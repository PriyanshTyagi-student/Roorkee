(function initHoverDefinitions() {
  function setup() {
    if (document.querySelector(".hover-tooltip")) return;
    if (!document.body) return;

    const tooltipLayer = document.createElement("div");
    tooltipLayer.className = "hover-tooltip";
    tooltipLayer.innerHTML =
      '<div class="hover-tooltip__body"><div class="hover-tooltip__accent"></div><div class="hover-tooltip__text"></div></div>';
      const tooltipText = tooltipLayer.querySelector(".hover-tooltip__text");
      document.body.appendChild(tooltipLayer);

      const tooltips = [
        {
          id: "source-canvas",
          selector: "#sourceCanvas",
          text: "Source Canvas: Displays the input image or test pattern used for sampling and quantization."
        },
        {
          id: "output-canvas",
          selector: "#outputCanvas",
          text: "Output Canvas: Shows the sampled and quantized result — each cell represents one sample value after quantization."
        },
        {
          id: "sample-size",
          selector: "#sampleSize",
          text: "Sample Size: Controls the spatial sampling resolution. Smaller values preserve more detail; larger values produce blockier sampling."
        },
        {
          id: "quant-levels",
          selector: "#quantLevels",
          text: "Quantization Levels: Number of gray levels used to represent each sampled value. Fewer levels increase quantization error and posterization."
        },
        {
          id: "apply-btn",
          selector: "#applyBtn",
          text: "Apply: Runs the sampling and quantization with current settings and updates the output canvas."
        },
        {
          id: "save-report",
          selector: "#saveReportBtn",
          text: "Save Report: Saves a snapshot of the current simulation output into the progress report system."
        }
      ];
      // {
      //   id: "output-graph",
      //   selector: ".graph-section, #graphPlot, #graphBars",
      //   text: "Output Graph: Plots terminal voltage (V) versus load current (A) using the readings you add to the table."
      // },
      // {
      //   id: "instructions",
      //   selector: ".instructions-wrapper, .instructions-btn, .instructions-panel, #instructionModal",
      //   text: "Instructions: Shows the required wiring sequence and the steps to run the experiment."
      // },
      // {
      //   id: "controls",
      //   selector: "#pill-stack",
      //   text: "Controls: Use these buttons to run the simulation (Speaking, Check, Auto Connect, Add To Table, Reset)."
      // }
    ];

    tooltips.forEach(({ selector }) => {
      document.querySelectorAll(selector).forEach((el) => el.removeAttribute("title"));
    });

    let activeTarget = null;

    function findEntry(target) {
      if (!target || target.nodeType !== 1) return null;
      for (const entry of tooltips) {
        const match = target.closest(entry.selector);
        if (match) return { match, text: entry.text, id: entry.id };
      }
      return null;
    }

    function moveTip(event) {
      const padding = 16;
      const offsetX = 14;
      const offsetY = 14;

      const maxLeft = window.innerWidth - tooltipLayer.offsetWidth - padding;
      const maxTop = window.innerHeight - tooltipLayer.offsetHeight - padding;

      const desiredLeft = event.clientX + offsetX;
      const desiredTop = event.clientY + offsetY;

      tooltipLayer.style.left = Math.max(padding, Math.min(desiredLeft, maxLeft)) + "px";
      tooltipLayer.style.top = Math.max(padding, Math.min(desiredTop, maxTop)) + "px";
    }

    function showTip(text, event) {
      if (!tooltipText) return;
      tooltipText.textContent = text;
      moveTip(event);
      tooltipLayer.classList.add("show");
    }

    function hideTip() {
      tooltipLayer.classList.remove("show");
    }

      function attachLeaveHandler(target) {
        target.addEventListener(
          "mouseleave",
          () => {
            if (activeTarget === target) {
              activeTarget = null;
              hideTip();
            }
          },
          { once: true }
        );
      }

      // Ensure MCB definition shows when its image is clicked.
      const mcbImage = document.querySelector(".mcb-toggle");
      if (mcbImage) {
        mcbImage.addEventListener("click", function (event) {
          const entry = tooltips.find(t => t.id === "mcb");
          if (!entry) return;
          if (activeTarget === mcbImage) {
            activeTarget = null;
            hideTip();
            return;
          }
          activeTarget = mcbImage;
          showTip(entry.text, event);
          attachLeaveHandler(mcbImage);
        });
      }

      document.addEventListener("click", function (event) {
        const searchTarget = event.target.closest("img") || event.target;
        const found = findEntry(searchTarget);
        if (!found || !found.match) {
          if (activeTarget) {
            activeTarget = null;
            hideTip();
          }
          return;
        }
        // Ensure we attach to the actual image element for leave handling.
        if (found.id === "mcb" && found.match.tagName !== "IMG") {
          const mcbImgEl = document.querySelector(".mcb-toggle");
          if (mcbImgEl) found.match = mcbImgEl;
        }
        if (found.match.tagName !== "IMG") {
          if (activeTarget) {
            activeTarget = null;
            hideTip();
          }
          return;
        }
        if (activeTarget === found.match) {
          activeTarget = null;
          hideTip();
          return;
        }
        activeTarget = found.match;
        showTip(found.text, event);
        attachLeaveHandler(activeTarget);
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          activeTarget = null;
          hideTip();
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
})();
