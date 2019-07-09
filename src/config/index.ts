export default {
  mysql: {
    databaseUrl:
      process.env.DATABASE_URL ||
      'mysql://root:123456@localhost:3306/super_id?charset:utf8mb4_unicode_ci&connectionLimit:10&flags:-FOUND_ROWS',
  },
  redis: {
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379/0',
  },
  twilio: {
    accountSid: 'AC65c4a4eea22881e334ecfc2413a5b776',
    authToken: '88f17c96632ab7851d45ab5fc7777dad',
    phone: '+12568297127',
  },
  facebook_account_kit: {
    APP_ID: '609298636149165',
    APP_SECRET: '2bbb61250021c967cbe79434c9490500',
    APP_KIT_SECRET: 'ae19b03aabdf16fa2fe6333e3126f528',
    GRAPH_URL: 'https://graph.facebook.com/v3.2',
    ACCESS_TOKEN_URL: 'https://graph.facebook.com/v3.2/oauth/access_token',
    REDIRECT_URI: 'http://localhost:3000/',
    ACCOUNT_KIT_URL: 'https://graph.accountkit.com/v1.3',
  },
  node_mailer: {
    host: 'smtp.gmail.com',
    service: 'Gmail',
    user: 'Super App',
    userMail: '20168267@sie.edu.vn',
    pass: 'khang0964419119',
  }
};
