import config from 'config';

const API_ROOT: string = config.apiRoot;

const apiConstant = Object.freeze({
  //Homepage
  homepage: `${API_ROOT}/homepage`,

  //Seo
  seo: `${API_ROOT}/seo`,

  //Settings
  settings: `${API_ROOT}/settings`,

  //Languages
  languages: `${API_ROOT}/language/list/100/0`,

  // Auth
  login: `${API_ROOT}/users/login`,
  logout: `${API_ROOT}/users/logout`,
  oAuth: `${API_ROOT}/users/oAuth`,
  me: `${API_ROOT}/users/me`,

  // Profile
  profile: `${API_ROOT}/administrators`,

  // Category
  category: `${API_ROOT}/category/public`,
  categoryBlog: `${API_ROOT}/category-blog`,

  //Product
  productPopular: `${API_ROOT}/items/most-popular/{limit}/{offset}`,
  productHotest: `${API_ROOT}/items/most-hotest/{limit}/{offset}`,
  productNewest: `${API_ROOT}/items/newest/{limit}/{offset}`,
  productFilter: `${API_ROOT}/items/filter`,
  productsRelated: `${API_ROOT}/items/related`,
  products: `${API_ROOT}/items`,
  featured: `${API_ROOT}/items/featured`,
  productsSale50: `${API_ROOT}/items/saleoff`,
  suggestProduct: `${API_ROOT}/items/suggest`,

  //Comment
  comments: `${API_ROOT}/comments`,

  // Review
  reviews: `${API_ROOT}/reviews`,

  //Flash Deal
  flashDeal: `${API_ROOT}/flashdeal`,

  //Help Center
  helpCenter: `${API_ROOT}/help`,
  helpCollection: `${API_ROOT}/category-help`,

  //Blog
  blog: `${API_ROOT}/blog/category`,
  blogDetail: `${API_ROOT}/blog`,

  //User
  users: `${API_ROOT}/users`,

  //Order
  orders: `${API_ROOT}/users/orders`,
  orderCancel: `${API_ROOT}/users/cancelOrder`,

  //Assets
  assets: `${API_ROOT}/assets/:limit/:offset`,
  downloadAsset: `${API_ROOT}/download/session`,
  downloadFree: `${API_ROOT}/download/free-download`,

  //Likes
  likes: `${API_ROOT}/users/likes`,

  //Coupon
  coupon: `${API_ROOT}/coupons`,

  //Administrator
  administrator: `${API_ROOT}/administrators`,

  // Media
  media: `${API_ROOT}/media`,

  //Checkout
  checkout: `${API_ROOT}/checkout`,

  // License:
  license: `${API_ROOT}/license`,
  downloadLicense: `${API_ROOT}/download/license`,

  // Banner
  banner: `${API_ROOT}/banner`,

  // Seller
  seller: `${API_ROOT}/seller`,
  withdraw: `${API_ROOT}/withdraw`,

  //notification
  notification: `${API_ROOT}/notifications`,

  // 3D Modeling Service
  modelingOrder: `${API_ROOT}/modeling-order`,
  modelingLandingPage: `${API_ROOT}/modeling-landing-page`,

  // Showroom
  showroom: `${API_ROOT}/showroom`,

  //Brands
  brands: `${API_ROOT}/brands`,

  //Dashboard
  reviewDetail: `${API_ROOT}/seller/reviews/{review_id}`,
});

export default apiConstant;
