"use strict";
var first_player = document.getElementById("player-one");
var second_player = document.getElementById("player-two");
var ball = document.getElementById("ball");
var current_timeout_is_running = false;
var current_score = {
  first: 0,
  second: 0,
};
var action = {
  loosing_side: "",
  lost: false,
};

function centerElement(element) {
  element.style.left =
    (
      document.documentElement.clientWidth / 2 -
      element.offsetWidth / 2
    ).toString() + "px";
  element.style.left =
    (
      document.documentElement.clientWidth / 2 -
      element.offsetWidth / 2
    ).toString() + "px";
  if (element == ball) {
    if (action.lost) {
      if (action.loosing_side == "first") {
        ball.style.top = (first_player.clientHeight + 5).toString() + "px";
      } else {
        ball.style.top =
          (
            document.documentElement.clientHeight -
            second_player.clientHeight -
            ball.clientHeight -
            5
          ).toString() + "px";
      }
    } else
      element.style.top =
        (document.documentElement.clientHeight / 2).toString() + "px";
  }
}

function add_event_listener_to_players() {
  window.addEventListener("keydown", function (event) {
    let code = event.keyCode;
    if (code == 68) {
      let left_numeric = parseInt(
        first_player.style.left.substring(0, first_player.style.left.length - 2)
      );
      left_numeric += 25;
      if (
        left_numeric + first_player.offsetWidth >
        document.documentElement.clientWidth
      ) {
        left_numeric =
          document.documentElement.clientWidth - first_player.offsetWidth;
      }
      first_player.style.left = left_numeric.toString() + "px";
      second_player.style.left = left_numeric.toString() + "px";
    } else if (code == 65) {
      let left_numeric = parseInt(
        first_player.style.left.substring(0, first_player.style.left.length - 2)
      );
      left_numeric -= 25;
      if (left_numeric < 0) {
        left_numeric = 0;
      }
      first_player.style.left = left_numeric.toString() + "px";
      second_player.style.left = left_numeric.toString() + "px";
    }
  });
}

function randomColorGenerator() {
  var symbol, color;
  symbol = "123456789ABCDEF";
  color = "#";
  for (var i = 0; i < 6; i++) {
    color += symbol[Math.floor(Math.random() * 16)];
  }
  return color;
}

function touched_upper_bar() {
  let ball_top_numerical = ball.getBoundingClientRect().top;
  let ball_left_numerical = ball.getBoundingClientRect().left;
  let bar_left_numerical = parseInt(
    first_player.style.left.substring(0, first_player.style.left.length - 2)
  );
  if (
    ball_top_numerical <= first_player.clientHeight &&
    ball_left_numerical + ball.clientWidth / 2 > bar_left_numerical &&
    ball_left_numerical + ball.clientWidth / 2 <
      bar_left_numerical + first_player.clientWidth
  ) {
    if (!current_timeout_is_running) {
      current_timeout_is_running = true;
      setTimeout(function () {
        current_score.first++;
        current_timeout_is_running = false;
        console.log("first", current_score.first);
      }, 300);
    }
    first_player.style.backgroundColor = randomColorGenerator();

    return true;
  }
  return false;
}
function touched_lower_bar() {
  let ball_top_numerical = ball.getBoundingClientRect().top;
  let ball_left_numerical = ball.getBoundingClientRect().left;
  let bar_left_numerical = parseInt(
    second_player.style.left.substring(0, second_player.style.left.length - 2)
  );
  if (
    ball_top_numerical + ball.clientHeight + second_player.clientHeight >=
      document.documentElement.clientHeight &&
    ball_left_numerical + ball.clientWidth / 2 > bar_left_numerical &&
    ball_left_numerical + ball.clientWidth / 2 <
      bar_left_numerical + second_player.clientWidth
  ) {
    if (!current_timeout_is_running) {
      current_timeout_is_running = true;
      setTimeout(function () {
        current_score.second++;
        current_timeout_is_running = false;
        console.log("second", current_score.second);
      }, 200);
    }

    second_player.style.backgroundColor = randomColorGenerator();
    return true;
  }
  return false;
}
function set_interval_for_ball() {
  let interval_id = setInterval(function () {
    let numeric_left = ball.getBoundingClientRect().left;
    let numeric_top = ball.getBoundingClientRect().top;
    if (numeric_left <= 0) {
      //hit left
      let class_present = ball.classList[0];
      if (class_present == "animate-top-left") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-top-right");
      } else if (class_present == "animate-bottom-left") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-bottom-right");
      }
    } else if (
      numeric_left + ball.offsetWidth >=
      document.documentElement.clientWidth
    ) {
      //hit right
      let class_present = ball.classList[0];
      if (class_present == "animate-top-right") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-top-left");
      } else if (class_present == "animate-bottom-right") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-bottom-left");
      }
    } else if (
      numeric_top <= 0 ||
      numeric_top + ball.offsetHeight >= document.documentElement.clientHeight
    ) {
      //game over
      ball.classList.remove(ball.classList[0]);
      if (numeric_top <= 0) {
        action.loosing_side = "first";
        action.lost = true;
      } else if (
        numeric_top + ball.offsetHeight >=
        document.documentElement.clientHeight
      ) {
        action.loosing_side = "second";
        action.lost = true;
      }
      centerElement(ball);
      centerElement(first_player);
      centerElement(second_player);

      alert("Game Over");
      clearInterval(interval_id);
      if (current_score.first > localStorage.getItem("first")) {
        localStorage.setItem("first", current_score.first);
      }
      if (current_score.second > localStorage.getItem("second")) {
        localStorage.setItem("second", current_score.second);
      }
      current_score.first = 0;
      current_score.second = 0;
      show_score();
    } else if (touched_lower_bar()) {
      //touched lower bar
      let class_present = ball.classList[0];
      if (class_present == "animate-bottom-right") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-top-right");
      } else if (class_present == "animate-bottom-left") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-top-left");
      }
    } else if (touched_upper_bar()) {
      //touched upper bar
      let class_present = ball.classList[0];
      if (class_present == "animate-top-right") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-bottom-right");
      } else if (class_present == "animate-top-left") {
        ball.classList.remove(class_present);
        ball.classList.add("animate-bottom-left");
      }
    }
  }, 1);
}
function show_score() {
  if (localStorage.getItem("first") == null) {
    localStorage.setItem("first", 0);
    localStorage.setItem("second", 0);
    window.alert(
      "This is your first time" +
        "\n" +
        "Press A for Left" +
        "\n" +
        "Press D for Right"
    );
  } else {
    window.alert(
      "Player 1 has a maximum score of " +
        localStorage.getItem("first").toString() +
        "\n" +
        "Player 2 has a maximum score of " +
        localStorage.getItem("second")
    );
  }
}

centerElement(first_player);
centerElement(second_player);
centerElement(ball);
show_score();
add_event_listener_to_players();
set_interval_for_ball();

document.addEventListener("keydown", function (event) {
  if (event.keyCode == 13) {
    if (action.lost) {
      if (action.loosing_side == "first") {
        ball.classList.add("animate-bottom-right");
      } else {
        ball.classList.add("animate-top-right");
      }
    } else ball.classList.add("animate-bottom-right");
    set_interval_for_ball();
  }
});
