var options = {
  removeFill: true,
  quickCopy: true,
};

$("#input-text").on("input", function () {
  update();
});

function update() {
  t = $("#input-text").val();
  $("#data-size-in").html(t.length);
  $("<span>", {
    text: "bytes",
    class: "unit",
  }).appendTo("#data-size-in");

  f_t = format(t);
  $("#data-size-out").html(f_t.length);
  $("<span>", {
    text: "bytes",
    class: "unit",
  }).appendTo("#data-size-out");
  $("#output-text").val(f_t);

  $("#original-preview").html(preFormat(t));
  $("#output-preview").html(f_t);
}

function preFormat(t) {
  return t.replace(/(?:width|height)\s*=\s*".*?"/g, "");
}

function format(t) {
  t = t.replace(/\b(?:width|height|fill-rule|clip-rule)\s*=\s*".*?"/g, "");
  if (options.removeFill) {
    t = t.replace(/\bfill\s*=\s*".*?"/g, "");
  }

  d_match = t.match(/\bd\s*=("|').*?\1/g);
  if (d_match) {
    d_token = "{{{" + generateToken(10) + "}}}";
    t = t.replace(/\bd\s*=("|').*?\1/g, d_token);

    for (let i = 0; i < d_match.length; i++) {
      let num_token = "{{{" + generateToken(5) + "}}}";
      let num_match = d_match[i].match(/[0-9.]+/g);
      let new_d = d_match[i].replace(/[0-9.]+/g, num_token);

      for (let j = 0; j < num_match.length; j++) {
        let new_num = Math.round(num_match[j] * 100) / 100;
        new_d = new_d.replace(num_token, new_num);
      }
      t = t.replace(d_token, new_d);
    }
  }
  if (!t.match(/\bfocusable *=/)) {
    t = t.replace(/<svg/, '<svg focusable="false"');
  }
  t = t.replace(/\n|\r/g, "");
  t = t.replace(/ *(\<.*?\>) */g, "$1");
  t = t.replace(/(?<=[^0-9])0\./g, ".");
  t = t.replace(/  +/g, " ");
  t = t.replace(/(= *("|').*?\2) +/g, "$1");
  return t;
}

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function generateToken(length) {
  let token = "";
  for (let i = 0; i < length; i++) {
    let rnd = getRnd(letters.length);
    token += letters[rnd];
  }
  return token;
}

function getRnd(max) {
  return Math.floor(Math.random() * 100) % max;
}

// Copy
$("#copy-area").hover(() => {
  $("#copy-icon").toggle();
  $("#copy-icon").removeClass("copied");
});

$("#copy-area").click(() => {
  if ($("#output-text").val != "") {
    e = document.getElementById("output-text");
    e.select();
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }
});

$("#copy-area").mousedown(() => {
  $("#copy-area").removeClass("copied");
  void document.getElementById("copy-area").offsetWidth;
  $("#copy-area").addClass("copied");
  $("#copy-icon").addClass("active");
});

$("#copy-area").mouseup(() => {
  $("#copy-icon").removeClass("active");
});

// Options
$("#option-list>li>input").on("input", function () {
  options.removeFill = $("#option-fill").prop("checked") ? true : false;
  options.quickCopy = $("#option-quickCopy").prop("checked") ? true : false;
  checkOptions();
  update();
});

function checkOptions() {
  if (options.quickCopy) {
    $("#copy-area").css({
      zIndex: 2,
    });
    $("#output-text").css({
      outline: "none",
    });
  } else {
    $("#copy-area").css({
      zIndex: -100,
    });
  }
}

function init() {
  checkOptions();
  update();
}

init();
