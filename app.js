// ==========================================
// VÒNG QUAY HỤI
// ==========================================

// Dữ liệu demo chạy trực tiếp trên máy
// Sau này có thể nối Firebase để realtime.


const state = {

  roomCode: "DEMO01",

  isHost: true,

  currentHui: "hui5",

  rotation: 0,

  spinning: false,

  hui: {

    hui5: {
      id: "hui5",
      name: "Hụi 5tr",
      amount: 5000000,

      people: [
        { id: "p1", name: "Nguyễn A", active: true },
        { id: "p2", name: "Nguyễn B", active: true },
        { id: "p3", name: "Nguyễn C", active: true },
        { id: "p4", name: "Nguyễn D", active: true },
        { id: "p5", name: "Nguyễn E", active: true }
      ],

      history: []
    },

    hui10: {
      id: "hui10",
      name: "Hụi 10tr",
      amount: 10000000,

      people: [
        { id: "a1", name: "Lan", active: true },
        { id: "a2", name: "Mai", active: true },
        { id: "a3", name: "Hương", active: true },
        { id: "a4", name: "Trang", active: true }
      ],

      history: []
    }

  }

};


// ==========================================
// DOM
// ==========================================

const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");

const currentHuiTitle =
  document.getElementById("currentHuiTitle");

const huiList =
  document.getElementById("huiList");

const peopleList =
  document.getElementById("peopleList");

const historyBox =
  document.getElementById("history");

const result =
  document.getElementById("result");

const spinBtn =
  document.getElementById("spinBtn");


// ==========================================
// KHỞI ĐỘNG
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  renderRoom();

  renderHui();

  renderPeople();

  renderHistory();

  drawWheel();

});


// ==========================================
// ROOM
// ==========================================

function renderRoom() {

  document
    .getElementById("roomCodeText")
    .textContent = state.roomCode;

  document
    .getElementById("roomInfo")
    .classList.remove("hidden");

  document
    .querySelectorAll(".host-only")
    .forEach(el => {
      el.classList.remove("hidden");
    });

}


// ==========================================
// HIỂN THỊ DÂY
// ==========================================

function renderHui() {

  huiList.innerHTML = "";

  Object.values(state.hui).forEach(h => {

    const div = document.createElement("div");

    div.className =
      "hui-item " +
      (h.id === state.currentHui ? "active" : "");

    div.innerHTML = `
      <div>${h.name}</div>
      <small>
        ${formatMoney(h.amount)}
      </small>
    `;

    div.onclick = () => {

      state.currentHui = h.id;

      result.textContent =
        "Chưa có kết quả";

      renderHui();

      renderPeople();

      renderHistory();

      drawWheel();

    };

    huiList.appendChild(div);

  });

  const current =
    state.hui[state.currentHui];

  if (current) {

    currentHuiTitle.textContent =
      "🎡 " + current.name;

  }

}


// ==========================================
// NGƯỜI
// ==========================================

function renderPeople() {

  const hui =
    state.hui[state.currentHui];

  peopleList.innerHTML = "";

  if (!hui) return;

  hui.people.forEach(person => {

    const div =
      document.createElement("div");

    div.className =
      "person " +
      (!person.active ? "inactive" : "");

    div.innerHTML = `

      <span>
        ${person.name}

        ${
          !person.active
          ? " — Đã hốt"
          : ""
        }
      </span>

      ${
        person.active
        ?
        `
        <button
          class="remove-btn"
          onclick="removePerson('${person.id}')">
          Xóa
        </button>
        `
        :
        ""
      }

    `;

    peopleList.appendChild(div);

  });

}


// ==========================================
// THÊM NGƯỜI
// ==========================================

document
  .getElementById("addPersonBtn")
  .onclick = () => {

    document
      .getElementById("personModal")
      .classList.remove("hidden");

  };


document
  .getElementById("cancelPersonBtn")
  .onclick = closePersonModal;


function closePersonModal() {

  document
    .getElementById("personModal")
    .classList.add("hidden");

}


document
  .getElementById("savePersonBtn")
  .onclick = () => {

    const input =
      document.getElementById(
        "personNameInput"
      );

    const name =
      input.value.trim();

    if (!name) {

      showToast("Nhập tên trước nha!");

      return;

    }

    const hui =
      state.hui[state.currentHui];

    hui.people.push({

      id:
        "p" +
        Date.now(),

      name,

      active: true

    });

    input.value = "";

    closePersonModal();

    renderPeople();

    drawWheel();

    showToast("Đã thêm người");

  };


// ==========================================
// XÓA NGƯỜI
// ==========================================

window.removePerson = function(id) {

  const hui =
    state.hui[state.currentHui];

  hui.people =
    hui.people.filter(
      p => p.id !== id
    );

  renderPeople();

  drawWheel();

};


// ==========================================
// VẼ VÒNG QUAY
// ==========================================

function drawWheel() {

  const hui =
    state.hui[state.currentHui];

  if (!hui) return;

  const people =
    hui.people.filter(
      p => p.active
    );

  const size =
    wheel.width;

  const center =
    size / 2;

  const radius =
    size / 2 - 8;

  ctx.clearRect(
    0,
    0,
    size,
    size
  );

  if (people.length === 0) {

    ctx.beginPath();

    ctx.arc(
      center,
      center,
      radius,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = "#ddd";

    ctx.fill();

    ctx.fillStyle = "#333";

    ctx.font = "bold 24px Arial";

    ctx.textAlign = "center";

    ctx.fillText(
      "Không còn người",
      center,
      center
    );

    return;

  }


  const slice =
    Math.PI * 2 /
    people.length;


  people.forEach(
    (person, index) => {

      const start =
        state.rotation +
        index * slice;

      const end =
        start + slice;


      ctx.beginPath();

      ctx.moveTo(
        center,
        center
      );

      ctx.arc(
        center,
        center,
        radius,
        start,
        end
      );

      ctx.closePath();


      ctx.fillStyle =
        `hsl(${index * 360 / people.length}, 75%, 65%)`;

      ctx.fill();

      ctx.strokeStyle = "#fff";

      ctx.lineWidth = 3;

      ctx.stroke();


      // TÊN
      ctx.save();

      ctx.translate(
        center,
        center
      );

      ctx.rotate(
        start + slice / 2
      );

      ctx.textAlign = "right";

      ctx.fillStyle = "#111";

      ctx.font =
        "bold 18px Arial";

      ctx.fillText(
        person.name,
        radius - 20,
        6
      );

      ctx.restore();

    }
  );


  // TÂM

  ctx.beginPath();

  ctx.arc(
    center,
    center,
    35,
    0,
    Math.PI * 2
  );

  ctx.fillStyle = "#fff";

  ctx.fill();

  ctx.strokeStyle = "#ddd";

  ctx.stroke();

}


// ==========================================
// QUAY
// ==========================================

spinBtn.onclick = spin;


function spin() {

  if (state.spinning)
    return;


  const hui =
    state.hui[state.currentHui];


  const people =
    hui.people.filter(
      p => p.active
    );


  if (people.length === 0) {

    showToast(
      "Không còn người để quay!"
    );

    return;

  }


  state.spinning = true;

  spinBtn.disabled = true;


  // Chọn ngẫu nhiên
  const winnerIndex =
    Math.floor(
      Math.random() *
      people.length
    );


  const slice =
    Math.PI * 2 /
    people.length;


  // Vị trí kim chỉ xuống phần thắng
  const target =
    -Math.PI / 2
    -
    (
      winnerIndex * slice
      +
      slice / 2
    );


  const extra =
    Math.PI * 2 *
    6;


  const current =
    state.rotation;


  const finalRotation =
    current
    +
    extra
    +
    normalizeAngle(
      target - current
    );


  const duration =
    5000;


  const startTime =
    performance.now();


  function animate(time) {

    const elapsed =
      time - startTime;

    const progress =
      Math.min(
        elapsed / duration,
        1
      );


    // easing
    const ease =
      1 -
      Math.pow(
        1 - progress,
        4
      );


    state.rotation =
      current
      +
      (
        finalRotation -
        current
      )
      * ease;


    drawWheel();


    if (progress < 1) {

      requestAnimationFrame(
        animate
      );

    } else {

      finishSpin(
        people,
        winnerIndex
      );

    }

  }


  requestAnimationFrame(
    animate
  );

}


// ==========================================
// KẾT QUẢ
// ==========================================

function finishSpin(
  people,
  winnerIndex
) {

  const hui =
    state.hui[state.currentHui];


  const winner =
    people[winnerIndex];


  result.innerHTML =
    `
      🎉 Người hốt:
      <strong>
        ${winner.name}
      </strong>
    `;


  // loại khỏi lượt sau

  const realPerson =
    hui.people.find(
      p => p.id === winner.id
    );

  if (realPerson) {

    realPerson.active = false;

  }


  // lịch sử

  hui.history.unshift({

    name: winner.name,

    time:
      new Date().toLocaleString(
        "vi-VN"
      )

  });


  state.spinning = false;

  spinBtn.disabled = false;


  renderPeople();

  renderHistory();

  drawWheel();

  showToast(
    "🎉 Đã có người hốt!"
  );

}


// ==========================================
// HISTORY
// ==========================================

function renderHistory() {

  const hui =
    state.hui[state.currentHui];

  historyBox.innerHTML = "";

  if (
    !hui ||
    hui.history.length === 0
  ) {

    historyBox.innerHTML =
      "<p>Chưa có lịch sử.</p>";

    return;

  }


  hui.history.forEach(
    (item, index) => {

      const div =
        document.createElement(
          "div"
        );

      div.className =
        "history-item";

      div.innerHTML =
        `
          <div class="history-name">
            ${index + 1}.
            ${item.name}
          </div>

          <div class="history-time">
            ${item.time}
          </div>
        `;

      historyBox.appendChild(
        div
      );

    }
  );

}


// ==========================================
// THÊM DÂY
// ==========================================

document
  .getElementById("addHuiBtn")
  .onclick = () => {

    document
      .getElementById("huiModal")
      .classList.remove("hidden");

  };


document
  .getElementById("cancelHuiBtn")
  .onclick = () => {

    document
      .getElementById("huiModal")
      .classList.add("hidden");

  };


document
  .getElementById("saveHuiBtn")
  .onclick = () => {

    const name =
      document
        .getElementById(
          "huiNameInput"
        )
        .value.trim();


    const amount =
      Number(
        document
          .getElementById(
            "huiAmountInput"
          )
          .value
      );


    if (!name) {

      showToast(
        "Nhập tên dây!"
      );

      return;

    }


    const id =
      "hui_" +
      Date.now();


    state.hui[id] = {

      id,

      name,

      amount,

      people: [],

      history: []

    };


    state.currentHui = id;


    document
      .getElementById(
        "huiNameInput"
      )
      .value = "";


    document
      .getElementById(
        "huiAmountInput"
      )
      .value = "";


    document
      .getElementById(
        "huiModal"
      )
      .classList.add(
        "hidden"
      );


    renderHui();

    renderPeople();

    renderHistory();

    drawWheel();


    showToast(
      "Đã thêm dây hụi!"
    );

  };


// ==========================================
// RESET DÂY
// ==========================================

document
  .getElementById("resetBtn")
  .onclick = () => {

    const ok =
      confirm(
        "Reset dây này? Những người đã hốt sẽ được quay lại."
      );

    if (!ok)
      return;


    const hui =
      state.hui[state.currentHui];


    hui.people.forEach(
      p => p.active = true
    );


    hui.history = [];


    result.textContent =
      "Chưa có kết quả";


    renderPeople();

    renderHistory();

    drawWheel();


    showToast(
      "Đã reset dây này!"
    );

  };


// ==========================================
// TẠO PHÒNG
// ==========================================

document
  .getElementById("createRoomBtn")
  .onclick = () => {

    state.roomCode =
      randomCode(6);

    renderRoom();

    showToast(
      "Đã tạo phòng!"
    );

  };


// ==========================================
// VÀO PHÒNG
// ==========================================

document
  .getElementById("joinRoomBtn")
  .onclick = () => {

    const code =
      document
        .getElementById(
          "roomCodeInput"
        )
        .value
        .trim()
        .toUpperCase();


    if (!code) {

      showToast(
        "Nhập mã phòng!"
      );

      return;

    }


    state.roomCode = code;

    state.isHost = false;


    document
      .querySelectorAll(
        ".host-only"
      )
      .forEach(
        el =>
          el.classList.add(
            "hidden"
          )
      );


    renderRoom();

    showToast(
      "Đã vào phòng!"
    );

  };


// ==========================================
// COPY LINK
// ==========================================

document
  .getElementById("copyRoomBtn")
  .onclick = async () => {

    const link =
      location.origin +
      location.pathname +
      "?room=" +
      state.roomCode;


    try {

      await navigator.clipboard.writeText(
        link
      );

      showToast(
        "Đã copy link phòng!"
      );

    } catch {

      showToast(
        link
      );

    }

  };


// ==========================================
// HELPER
// ==========================================

function normalizeAngle(angle) {

  while (
    angle < 0
  ) {

    angle +=
      Math.PI * 2;

  }

  while (
    angle >= Math.PI * 2
  ) {

    angle -=
      Math.PI * 2;

  }

  return angle;

}


function randomCode(length) {

  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let result = "";

  for (
    let i = 0;
    i < length;
    i++
  ) {

    result +=
      chars[
        Math.floor(
          Math.random() *
          chars.length
        )
      ];

  }

  return result;

}


function formatMoney(number) {

  if (!number)
    return "0đ";

  return number.toLocaleString(
    "vi-VN"
  ) + "đ";

}


function showToast(message) {

  const toast =
    document.getElementById(
      "toast"
    );

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );


  setTimeout(
    () => {

      toast.classList.remove(
        "show"
      );

    },
    2500
  );

}