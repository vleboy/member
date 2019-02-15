// 系统配置参数
const config = require('config')											// 配置文件
const port = config.server.port												// 系统端口
const staticRoot = config.server.staticRoot									// 静态根目录
// 应用服务相关
const Koa = require('koa')													// KOA应用框架
const cors = require('@koa/cors')                                           // 跨域中间件
const koaBody = require('koa-body')								            // 入参JSON解析中间件
const staticServer = require('koa-static')									// 静态资源服务中间件
const mount = require('koa-mount')											// 挂载点中间件
// 应用中间件
const xcontroller = require('koa-xcontroller')								// koa-xcontroller，自动路由中间件
const xnosql = require('koa-xnosql')										// koa-xnosql，自动NOSQL中间件
const xerror = require('koa-xerror')                                        // koa-xerror，自动异常捕获中间件
const xauth = require('koa-xauth')                                          // koa-xauth，自动身份认证中间件
const xlog = require('koa-xlog')                                            // koa-xlog，自动日志中间件
// 日志相关
const log = require('tracer').colorConsole({ level: config.log.level })     // 日志服务
const cron = require('node-cron')
const settlement = require('./src/server/settlement')

// 初始化应用服务
const app = new Koa()
// 启用静态资源服务
app.use(mount('/mobile/', staticServer(__dirname + '/member-mobile/dist')))
app.use(mount('/admin/', staticServer(__dirname + '/member-admin/dist')))

app.use(mount('/', cors()))             // 跨域中间件
app.use(xerror(config.error))           // 全局错误捕获中间件，必须第一位使用，参数1：错误配置
app.use(koaBody())                      // 入参JSON解析中间件
app.use(xlog(config.log, (ctx) => { log.info('异步日志处理', ctx.request.body) }))    //日志中间件，参数1：日志配置，参数2：额外日志处理
app.use(xauth(config.auth, (v) => v))   // TOKEN身份认证中间件，，参数1：认证配置，参数2：额外自定义TOKEN解析规则

// 1,加载koa-xcontroller中间件
xcontroller.init(app, config.server)            // 应用实例，可选配置：访问根路径，控制器目录路径

// 2,加载koa-xnosql中间件
xnosql.init(app, config.server)                 // 初始化mongodb连接

// 启动应用服务
app.listen(port)

cron.schedule('0 0 1 * *', () => {
    console.log('开始执行定时程序，当前执行时间',new Date())
    settlement()
}, {
        scheduled: true,
        timezone: "Asia/Chongqing"
    });

cron.schedule('0 0 16 * *', () => {
    console.log('开始执行定时程序，当前执行时间',new Date())
    settlement()
}, {
        scheduled: true,
        timezone: "Asia/Chongqing"
    });
log.info(`XServer应用启动【执行环境:${process.env.NODE_ENV},端口:${port}】`)
log.warn(`模拟用户登录路径【localhost:${port}${config.server.controllerRoot}/auth/login】`)
log.warn(`静态资源访问路径【localhost:${port}${staticRoot}*】`)
log.warn(`RESTful  API路径【localhost:${port}${config.server.controllerRoot}/MODULE_NAME/*】`)
log.info(`===============================================================`)
log.warn(`XNosql服务已启动`)
log.info(`[POST]http://localhost:${port}/xnosql/MODEL/insert`)
log.info(`[POST]http://localhost:${port}/xnosql/MODEL/update`)
log.info(`[POST]http://localhost:${port}/xnosql/MODEL/query`)
log.info(`[POST]http://localhost:${port}/xnosql/MODEL/page`)
log.info(`[GET ]http://localhost:${port}/xnosql/MODEL/get/:id`)
log.info(`[GET ]http://localhost:${port}/xnosql/MODEL/delete/:id`)