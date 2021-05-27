"use strict";

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  const lastLogs = logSources.map((logSource) => ({
    source: logSource,
    value: logSource.pop(),
  }));

  while (lastLogs.some((lastLog) => lastLog.source.drained === false)) {
    const newLog = lastLogs.reduce((log, lastLog) => {
      if (
        lastLog.source.drained === false &&
        (log === null ||
          log.value === false ||
          log.value.date > lastLog.value.date)
      ) {
        return lastLog;
      }
      return log;
    }, null);

    printer.print(newLog.value);

    newLog.value = newLog.source.pop();
  }

  return console.log("Sync sort complete.");
};
