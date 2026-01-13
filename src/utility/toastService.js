let _showFn = null;

export function setToastHandler(fn) {
  // accept a function, null, or an object exposing a callable `show`/`showToast` method
  if (
    fn === null ||
    typeof fn === "function" ||
    (typeof fn === "object" &&
      fn !== null &&
      (typeof fn.show === "function" || typeof fn.showToast === "function"))
  ) {
    _showFn = fn;
  } else {
    // ignore invalid handlers
    // eslint-disable-next-line no-console
    console.warn("toastService: attempted to set invalid handler", fn);
    _showFn = null;
  }
}

export function showToast(message, type = "success") {
  console.log("whyy", _showFn);
  try {
    if (!_showFn) return;

    if (typeof _showFn === "function") {
      _showFn(message, type);
      return;
    }

    if (typeof _showFn.show === "function") {
      _showFn.show(message, type);
      return;
    }

    if (typeof _showFn.showToast === "function") {
      _showFn.showToast(message, type);
      return;
    }

    // fallback: try calling as function (in case typeof lied)
    try {
      _showFn(message, type);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("toastService: handler is not callable", err);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("toastService error", e);
  }
}

export default {
  setToastHandler,
  showToast,
};
