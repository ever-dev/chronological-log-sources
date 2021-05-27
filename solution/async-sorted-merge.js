"use strict";

const logSort = (log1, log2) => {
  return log1.value.date < log2.value.date
    ? -1
    : log1.value.date > log2.value.date
    ? 1
    : 0;
};

// Print all entries, across all of the *async* sources, in chronological order.
module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {
    let lastLogs = await Promise.all(
      logSources.map(async (logSource) => ({
        source: logSource,
        value: await logSource.popAsync(),
      }))
    );

    while (lastLogs.length > 0) {
      lastLogs.sort(logSort);
      printer.print(lastLogs[0].value);
      lastLogs[0].value = await lastLogs[0].source.popAsync();
      lastLogs = lastLogs.filter(
        (log) => log.source.drained === false && log.source.value !== false
      );
    }

    resolve(console.log("Async sort complete."));
  });
};
