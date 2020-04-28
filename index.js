//Requires
const program = require("commander");
const Backtester = require('./src/backtester');
const Ticker = require('./src/ticker')
const Trader = require('./src/trader')

const now = new Date
const yesterday = new Date(now.getTime() - (24 * 60 * 60*1e3));
const sDay = 15
const eDay = 11
const customStartDay = new Date(now.getTime() - (sDay*24 * 60 * 60*1e3));
const customEndDay = new Date(now.getTime() - (eDay*24 * 60 * 60*1e3));

function toDate(val) {
    return new Date(val*1e3)
}

program
  .version("1.0.0")
  .option(
    "-i,--interval [interval]",
    "Interval in seconds for candlestick",
    parseInt
  )
  .option("-p, --product [product]", "Product identifier", "BTC-USD")
  .option("-s, --start [start]", "Start time in unix seconds", toDate, customStartDay)
  .option("-e, --end [end]", "End time in unix seconds", toDate, customEndDay)
  .option('-t, --strategy [strategy]', "Strategy Type")
  .option("-r, --type [type]", 'Run type')
  .option("-f, --funds [funds]", 'Amount of money to use', parseInt)
  .option('-l, --live', 'Run live')
  .parse(process.argv);

//Configurations
const main = async function() {
  const { interval, product, start, end, strategy, live, type, funds } = program;

  if(type == "trader") {
    const trader = new Trader({
      start, end, product: 'BTC-USD', interval, strategyType: strategy, live, funds
    })

    await trader.start()
  } else {
      const tester = new Backtester({
        start, end, product, interval, strategyType: strategy
    })

    await tester.start() 
  }
};

main();