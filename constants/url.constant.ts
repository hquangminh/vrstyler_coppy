const urlPage = {
  explore: '/explore/{category}',
  saleOff: '/sale-off/{category}',
  freeModels: '/free-models/{category}',
  productDetail: '/product/{slug}',
  productPreviewDetail: '/product/preview/{slug}',
  license: '/license/{slug}',
  blog: '/blog/all',
  blogCategory: '/blog/{category}',
  help: '/help-center',
  cart: '/cart',
  helpCenterCollection: '/help-center/{slug}',
  helpDetail: '/help-center/{collection-slug}/{article-slug}',
  contact_us: '/contact-us',
  my_order: '/user/my-orders',
  my_model: '/user/models',
  my_model_like: '/user/likes',
  my_settings: '/user/setting',
  my_settings_email: '/user/settings/email',
  withdraw: '/withdraw',
  notification: '/notification',

  //Seller
  upload: '/upload-model/new',
  seller_profile: '/seller/{nickname}',

  //3D Modeling Service
  modeling_homepage: '/modeling',
  modeling_order: '/modeling/orders',
  modeling_create_order: '/modeling/orders/new',
  modeling_order_detail: '/modeling/orders/{id}',

  //Showroom
  showroom: '/showroom',
  showroom_top_review: '/showroom/top-review',
  showroom_top_view: '/showroom/top-view',
  showroom_top_sold: '/showroom/top-sold',
  showroom_chanel: '/showroom/{nickname}',
  showroom_detail: '/showroom/{nickName}/products/{category}',
  showroom_dashboard_general: '/showroom/dashboard/general',
  showroom_dashboard_model: '/showroom/dashboard/models',
  showroom_dashboard_order: '/showroom/dashboard/orders',
  showroom_dashboard_withdraw: '/showroom/dashboard/withdraw',

  //Dashboard
  dashboard: '/dashboard',
  dashboard_model: '/dashboard/models',
  dashboard_order: '/dashboard/orders',
  dashboard_order_detail: '/dashboard/orders/{orderID}',
  dashboard_review: '/dashboard/reviews',
  dashboard_withdraw: '/dashboard/withdraw',
  dashboard_showroom_theme: '/dashboard/showroom/theme',
  dashboard_showroom_theme_decoration: '/dashboard/showroom/theme/{themeID}',
  dashboard_showroom_theme_preview: '/dashboard/showroom/theme/preview/{themeID}',
  dashboard_showroom_card: '/dashboard/showroom/card',
  dashboard_showroom_category: '/dashboard/showroom/category',
  dashboard_setting: '/dashboard/setting',

  // Redirect
  redirect_login: '/login?redirect=',

  // Verify
  verify: '/verify',
};

export default urlPage;
