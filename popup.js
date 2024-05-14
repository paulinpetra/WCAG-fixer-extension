function checkAccessability() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        files: ["axe.min.js"],
      })
      .then(() => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: function () {
            axe.run(document, (err, results) => {
              if (err) {
                console.error(err);
                return;
              }
              results.violations.forEach((violation) => {
                violation.nodes.forEach((node) => {
                  const reason = node.failureSummary;
                  const selector = node.target.join(",");
                  const elements = document.querySelectorAll(selector);

                  elements.forEach((element) => {
                    element.title = reason;
                    element.style.border = "1px solid red";
                  });
                });
              });
            });
          },
        });
      });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const checkButton = document.getElementById("checkButton");
  checkButton.addEventListener("click", checkAccessability);
});
