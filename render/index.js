import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import {connect} from 'react-redux'
import Slider from 'vtex.react-slick'
import ShelfProduct from './ShelfProduct'
import React, {Component, PropTypes} from 'react'

const defaultProductQty = 4

class ShelfSlider extends Component {
  constructor (props) {
    super(props)
    this.createCarouselItem = this.createCarouselItem.bind(this)
  }

  createCarouselItem (product) {
    const {
      imgWidth,
      imgHeight,
      textStyle,
      priceStyle,
      buttonText,
      buttonStyle,
      imgBackgroundColor,
    } = this.props

    return (
      <div key={product.slug}>
        <ShelfProduct
          {...product}
          buttonStyle={buttonStyle}
          buttonText={buttonText}
          imgBackgroundColor={imgBackgroundColor}
          imgHeight={imgHeight || null}
          imgWidth={imgWidth || null}
          priceStyle={priceStyle}
          textStyle={textStyle}
        />
      </div>
    )
  }

  render () {
    const {title: titleProp, data, titleStyle, products: productsFromProps} = this.props
    const productsFromQuery = data ? data.products : null
    const products = productsFromProps || productsFromQuery || []
    const productQty = products.length || 0
    const slidesToShow = this.props.qty || (productQty >= 4 ? 4 : productQty)
    const slidesToScroll = this.props.qty || 1
    const settingsDesktop = {
      dots: false,
      arrows: true,
      infinite: true,
      autoplay: false,
      draggable: false,
      slidesToShow: slidesToShow,
      slidesToScroll: slidesToScroll,
      ...this.props.slickSettings,
    }

    const slidesToShowTouch = this.props.qty || (productQty >= 2 ? 2 : productQty)
    const settingsTouch = {
      ...settingsDesktop,
      arrows: false,
      draggable: true,
      slidesToShow: slidesToShowTouch,
      ...this.props.slickSettings,
    }

    const shelfItems = products.map(this.createCarouselItem)
    const title = shelfItems.length > 0 && titleProp ? titleProp : ''

    return (
      <div className="ph1 bt b--black-10">
        <h2 className={titleStyle || 'font-display f3 normal ma0 pt3 mb2 black-70 light-secondary'}>
          {title}
        </h2>
        <div className="dn db-ns">
          <Slider {...settingsDesktop}>
            {shelfItems}
          </Slider>
        </div>
        <div className="db dn-ns">
          <Slider {...settingsTouch}>
            {shelfItems}
          </Slider>
        </div>
      </div>
    )
  }
}

ShelfSlider.propTypes = {
  brands: PropTypes.arrayOf(PropTypes.string),
  buttonStyle: PropTypes.string,
  buttonText: PropTypes.string,
  category: PropTypes.string,
  collection: PropTypes.string,
  data: PropTypes.object,
  imgBackgroundColor: PropTypes.string,
  imgHeight: PropTypes.number,
  imgWidth: PropTypes.number,
  priceStyle: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.object),
  qty: PropTypes.number,
  slickSettings: PropTypes.object,
  textStyle: PropTypes.string,
  title: PropTypes.string,
  titleStyle: PropTypes.string,
}

const query = gql`
  query ProductsQuery($category: String, $brands: String, $collection: String, $pageSize: Int){
    products(category: $category, brands: $brands, collection: $collection, pageSize: $pageSize, availableOnly: true) {
      name,
      slug,
      skus {
        images {
          src
        },
        offers {
          price,
          listPrice
        }
      }
    }
  }
`

const options = ({category, brands, collection, productQty, products}) => ({
  variables: {
    category,
    brands,
    collection,
    pageSize: productQty || defaultProductQty,
  },
  skip: products,
})

const Shelf = graphql(query, {options})(ShelfSlider)

const ShelfConnected = connect()(Shelf)
delete ShelfConnected.fetchData
export default ShelfConnected
