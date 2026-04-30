/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://kdsreadymadeudhyog.com.np',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin*', '/api*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
  },
}
