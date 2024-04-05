import { SitemapStream, streamToPromise } from 'sitemap';
import blogServices from 'services/blog-services';
import productServices from 'services/product-services';
import categoryServices from 'services/category-services';
import { changeToSlug } from 'common/functions';

const Sitemap = async (req: any, res: any) => {
  try {
    const smStream = new SitemapStream({
      hostname: `https://${req.headers.host}`,
    });

    smStream.write({ url: '', changefreq: 'hourly', img: '/static/thumbnail.jpg', priority: 1 });
    smStream.write({
      url: '/explore/all',
      changefreq: 'hourly',
      img: '/static/thumbnail.jpg',
      priority: 1,
    });
    smStream.write({
      url: '/explore/all?sort=best-selling',
      changefreq: 'hourly',
      img: '/static/thumbnail.jpg',
      priority: 0.8,
    });
    smStream.write({
      url: '/sale-off/all',
      changefreq: 'daily',
      img: '/static/thumbnail.jpg',
      priority: 1,
    });
    smStream.write({
      url: '/free-models/all',
      changefreq: 'daily',
      img: '/static/thumbnail.jpg',
      priority: 1,
    });
    smStream.write({
      url: '/blog',
      changefreq: 'daily',
      img: '/static/thumbnail.jpg',
      priority: 0.8,
    });
    smStream.write({
      url: '/help-center',
      changefreq: 'monthly',
      img: '/static/thumbnail.jpg',
      priority: 0.5,
    });
    smStream.write({
      url: '/contact-us',
      changefreq: 'yearly',
      img: '/static/thumbnail.jpg',
      priority: 0.5,
    });

    // List of category
    const category = await categoryServices.getAllCategory();
    if (!category.error)
      category.data.forEach((item: any) => {
        smStream.write({
          url: `/explore/${changeToSlug(item.title) + '--' + item.id}`,
          img: item.image,
          changefreq: 'daily',
          priority: 0.8,
        });
      });

    // List of newest products
    const newProducts = await productServices.getProductNewest(0, 100);
    if (!newProducts.error)
      newProducts.data.forEach((item: any) => {
        smStream.write({
          url: `/product/${changeToSlug(item.title) + '--' + item.id}`,
          img: item.image,
          changefreq: 'monthly',
          priority: 0.5,
        });
      });

    // List of popular products
    const popularProducts = await productServices.getProductPopular(0, 100);
    if (!popularProducts.error)
      popularProducts.data.forEach((item: any) => {
        smStream.write({
          url: `/product/${changeToSlug(item.title) + '--' + item.id}`,
          img: item.image,
          changefreq: 'monthly',
          priority: 0.5,
        });
      });

    // List of blogs
    const blogs = await blogServices.getList();
    if (!blogs.error)
      blogs.data.forEach((item: any) => {
        smStream.write({
          url: `/blog/${changeToSlug(item.title) + '--' + item.id}`,
          img: item.image,
          changefreq: 'monthly',
          priority: 0.5,
        });
      });

    // End sitemap stream
    smStream.end();

    // XML sitemap string
    const sitemapOutput = (await streamToPromise(smStream)).toString();

    // Change headers
    res.writeHead(200, {
      'Content-Type': 'application/xml',
    });

    // Display output to user
    res.end(sitemapOutput);
  } catch (e) {
    console.log(e);
    res.send(JSON.stringify(e));
  }
};
export default Sitemap;
