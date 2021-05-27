"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {
    const lastLogs = logSources.map((logSource) => ({
      source: logSource,
      value: logSource.popAsync(),
    }));

    while (lastLogs.some((lastLog) => lastLog.source.drained === false)) {
      await Promise.all(lastLogs.map((lastLog) => lastLog.value)).then(
        (logValues) => {
          const newLog = logValues.reduce(
            (acc, logValue, index) => {
              if (
                lastLogs[index].source.drained === false &&
                (acc.log === null ||
                  acc.log === false ||
                  acc.log.date > logValue.date)
              ) {
                return { index, log: logValue };
              }
              return acc;
            },
            { index: 0, log: null }
          );

          printer.print(newLog.log);

          lastLogs[newLog.index].value = lastLogs[newLog.index].source.pop();
        }
      );
    }

    resolve(console.log("Async sort complete."));
  });
};
