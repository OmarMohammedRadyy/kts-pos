/* Presentation-only helpers for the cashier workspace. */
window.POSDesign = {
  feedbackTimer: null,
  guideLocked: false,
  startClock() {
    const update = () => {
      const clock = UI.$("operationsClock");
      if (!clock) return;
      clock.textContent = new Intl.DateTimeFormat("ar-KW", {
        timeZone: "Asia/Kuwait",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());
    };
    update();
    this.clockTimer = setInterval(update, 30000);
  },
  setGuide(state, title, detail, shortcut) {
    const heading = document.querySelector(".transaction-heading");
    if (!heading) return;
    heading.dataset.state = state;
    UI.$("transactionGuideTitle").textContent = title;
    UI.$("transactionGuideDetail").textContent = detail;
    UI.$("transactionGuideShortcut").textContent = shortcut || "";
    UI.$("transactionGuideShortcut").hidden = !shortcut;
  },
  updateProgress(stage) {
    const order = ["product", "review", "payment"];
    const current = order.indexOf(stage);
    for (const [index, step] of document
      .querySelectorAll(".transaction-progress [data-step]")
      .entries()) {
      step.classList.toggle("complete", index < current);
      step.classList.toggle("active", index === current);
      if (index === current) step.setAttribute("aria-current", "step");
      else step.removeAttribute("aria-current");
    }
  },
  updateTransactionContext() {
    const quantity = POS.cart.reduce((sum, line) => sum + Number(line.qty), 0);
    const rail = document.querySelector(".transaction-rail");
    const active = quantity > 0;
    document.body.classList.toggle("transaction-active", active);
    if (rail) rail.dataset.stage = active ? "payment" : "product";
    this.updateProgress(active ? "payment" : "product");
    const paymentLabel = {
      cash: "نقدًا",
      knet: "K-Net",
      split: "دفع مقسّم",
    }[POS.payment];
    const paymentNote = document.querySelector(".payment-heading small");
    if (paymentNote)
      paymentNote.textContent = active
        ? `التحصيل المحدد: ${paymentLabel}`
        : "اختر وسيلة التحصيل";
    if (this.guideLocked) return;
    if (active)
      this.setGuide(
        "ready",
        "جاهز للتحصيل",
        `${quantity} قطعة · المستحق ${UI.money(POS.totals.net_total)}`,
        "F10",
      );
    else
      this.setGuide(
        "scan",
        "ابدأ بإضافة صنف",
        "امسح الباركود أو ابحث بالاسم",
        "F2",
      );
  },
  announceAdded(product) {
    clearTimeout(this.feedbackTimer);
    this.guideLocked = true;
    const line = POS.cart.find((item) => item.product_id === product.id);
    this.setGuide(
      "success",
      `تمت إضافة ${product.name_ar}`,
      `الكمية في السلة ${line?.qty || 1} · ${UI.money(product.sale_price)}`,
      "",
    );
    this.updateProgress("review");
    this.feedbackTimer = setTimeout(() => {
      this.guideLocked = false;
      POS.lastAddedProductId = null;
      document
        .querySelectorAll(".cart-row.recently-added")
        .forEach((row) => row.classList.remove("recently-added"));
      this.updateTransactionContext();
    }, 1700);
  },
  reportError(message) {
    clearTimeout(this.feedbackTimer);
    this.guideLocked = true;
    this.setGuide("error", "تعذر تنفيذ الخطوة", message, "");
    this.feedbackTimer = setTimeout(() => {
      this.guideLocked = false;
      this.updateTransactionContext();
    }, 2600);
  },
  bindFocusGuidance() {
    UI.$("posSearchInput")?.addEventListener("focus", () => {
      if (this.guideLocked) return;
      this.setGuide(
        "scan",
        "أدخل الصنف التالي",
        "الاسم أو SKU أو الباركود",
        "F2",
      );
      this.updateProgress("product");
    });
    UI.$("posSearchInput")?.addEventListener("blur", () =>
      setTimeout(() => this.updateTransactionContext(), 200),
    );
    UI.$("memberSearchInput")?.addEventListener("focus", () => {
      if (this.guideLocked) return;
      this.setGuide(
        "member",
        "تحقق من العضوية",
        "أدخل رقم العضوية أو المدني أو الهاتف",
        "F8",
      );
    });
    UI.$("memberSearchInput")?.addEventListener("blur", () =>
      setTimeout(() => this.updateTransactionContext(), 200),
    );
  },
};

const originalAdd = POS.add;
POS.add = function (product) {
  this.lastAddedProductId = product.id;
  const added = originalAdd.call(this, product);
  if (added) POSDesign.announceAdded(product);
  else this.lastAddedProductId = null;
  return added;
};

const originalRenderCart = POS.renderCart;
POS.renderCart = function () {
  originalRenderCart.call(this);
  document.querySelectorAll("#cartItems .cart-row").forEach((row, index) => {
    const line = this.cart[index];
    if (!line) return;
    row.dataset.productId = line.product_id;
    row.classList.toggle(
      "recently-added",
      line.product_id === this.lastAddedProductId,
    );
  });
  POSDesign.updateTransactionContext();
};

const originalRenderTotals = POS.renderTotals;
POS.renderTotals = function () {
  originalRenderTotals.call(this);
  POSDesign.updateTransactionContext();
};

const originalRenderPayment = POS.renderPayment;
POS.renderPayment = function () {
  originalRenderPayment.call(this);
  POSDesign.updateTransactionContext();
};

const originalRenderSplitStatus = POS.renderSplitStatus;
POS.renderSplitStatus = function () {
  originalRenderSplitStatus.call(this);
  const status = UI.$("splitStatus");
  status.classList.toggle("balanced", !status.classList.contains("error"));
};

const originalToast = UI.toast.bind(UI);
UI.toast = function (message, error = false) {
  originalToast(message, error);
  if (error && window.Auth?.viewName === "pos") POSDesign.reportError(message);
};

window.addEventListener("DOMContentLoaded", () => {
  POSDesign.startClock();
  POSDesign.bindFocusGuidance();
  POSDesign.updateTransactionContext();
});
