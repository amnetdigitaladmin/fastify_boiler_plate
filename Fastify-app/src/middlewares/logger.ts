import Logger = require("bunyan");

const rotatingFileStreamOptions: Logger.RotatingFileStreamOptions = {
  period: "1d",
  count: 10,
  path: "logs.log",
};
// const rotatingFileStream: Logger.RotatingFileStream =
//   new Logger.RotatingFileStream(rotatingFileStreamOptions);
// rotatingFileStream.write("hello");

let level: number;
level = Logger.resolveLevel("trace");
level = Logger.resolveLevel("debug");
level = Logger.resolveLevel("info");
level = Logger.resolveLevel("warn");
level = Logger.resolveLevel("error");
level = Logger.resolveLevel("fatal");

const options: Logger.LoggerOptions = {
  name: "org-logger",
  serializers: Logger.stdSerializers,
  streams: [   
    {
      type: "file",
      path: './logs.log', // Define the file path,
      level: Logger.INFO,
      closeOnExit: false,
      period: "1d",
      count: 3,
    },    
  ],
};
const log = Logger.createLogger(options);
const customSerializer = (anything: any) => {
  return { obj: anything };
};
log.addSerializers({ anything: customSerializer });
log.addSerializers(Logger.stdSerializers);
log.addSerializers({
  err: Logger.stdSerializers.err,
  req: Logger.stdSerializers.req,
  res: Logger.stdSerializers.res,
});
log.levels();
class MyLogger extends Logger {
  constructor() {
    super(options);
    
  }
  // rotatingFileStream: Logger.RotatingFileStream =
  // new Logger.RotatingFileStream(rotatingFileStreamOptions);
  customSerializer = (anything: any) => {
    return { obj: anything };
  };
}

export default new MyLogger();
