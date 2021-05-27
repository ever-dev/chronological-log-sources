"use strict";

// Print all entries, across all of the sources, in chronological order.

const logSort = (log1, log2) => {
  return log1.value.date < log2.value.date
    ? -1
    : log1.value.date > log2.value.date
    ? 1
    : 0;
};

module.exports = (logSources, printer) => {
  let lastLogs = logSources.map((logSource) => ({
    source: logSource,
    value: logSource.pop(),
  }));

  while (lastLogs.length > 0) {
    lastLogs.sort(logSort);
    printer.print(lastLogs[0].value);
    lastLogs[0].value = lastLogs[0].source.pop();
    lastLogs = lastLogs.filter((log) => log.source.drained === false && log.source.value !== false);
  }

  return console.log("Sync sort complete.");
};
