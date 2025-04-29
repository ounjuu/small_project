// input 입력 데이터
let alldata = [];

const submitButton = document.getElementById("submit");
const input1 = document.getElementById("chart-input1");
const input2 = document.getElementById("chart-input2");
const tableBody = document.getElementById("table-body");

// 페이지 로드
document.addEventListener("DOMContentLoaded", () => {
  makeTable();
});

// 1. 그래프 생성
const makeGraph = () => {
  const chartContainer = document.querySelector(".chart-container");
  const maxValue = Math.max(...alldata.map((item) => item.value)); // 최대값을 계산
  chartContainer.innerHTML = ""; // 그래프 초기화

  // y축 선 추가
  const yAxis = document.createElement("div");
  chartContainer.appendChild(yAxis);

  // x축 선 추가
  const xAxis = document.createElement("div");
  xAxis.classList.add("chart-x-axis");
  chartContainer.appendChild(xAxis);

  // y축 100% 표시
  const yLabel = document.createElement("div");
  yLabel.classList.add("chart-y-label");
  yLabel.innerText = "100%";
  chartContainer.appendChild(yLabel);

  // 막대그래프 생성
  alldata.forEach((item, i) => {
    const barHeight = (item.value / maxValue) * 100; // 값에 비례한 높이 계산

    // 그래프 바
    const bar = document.createElement("div");
    bar.classList.add("chart-bar");
    bar.style.height = `${barHeight}%`; // 높이 설정
    bar.style.left = `${i * 35}px`; // 막대의 x 위치 설정 (간격을 위한 설정)

    // x축 레이블 (id 값)
    const label = document.createElement("div");
    label.innerText = item.id; // x축 레이블 (ID값)
    label.classList.add("x-label");
    label.style.left = `${i * 35}px`;

    // x축 레이블을 xAxis에 추가
    xAxis.appendChild(label);

    // 막대그래프와 레이블을 차례대로 추가
    chartContainer.appendChild(bar);
  });
};

// 테이블 생성하는 함수
const makeTable = () => {
  alldata = JSON.parse(localStorage.getItem("chartdata")) || [];

  const chartTable = document.querySelector(".chart-tbody");
  chartTable.innerHTML = alldata
    .map((x, i) => {
      return `<tr id="tr${x.id}">
                <td class="id${x.id} tdsize3">
                    <div>${x.id}</div>
                    <span></span>
                </td>
                <td class="value${x.id} tdsize3">
                    <div>${x.value}</div>
                    <span></span>
                </td>
                <td class="chart-buttons">
                    <button class="fixbtn${x.id}" onclick="updateData(${x.id})" data-label="수정">
                    수정
                    </button>
                    <button class="deletebtn${x.id}" onclick="deleteData(${x.id})">
                    삭제
                    </button>
                </td>
            </tr>`;
    })
    .join("");

  makeGraph();
};

// input 값 저장하는 함수
function save() {
  let newData = { id: input1.value, value: input2.value };
  alldata.push(newData);
  localStorage.setItem("chartdata", JSON.stringify(alldata));
  makeTable();
  loadToTextarea();
  resetinput();
}

function resetinput() {
  input1.value = "";
  input2.value = "";
}
// 수정 기능
const updateData = (index) => {
  const updataBtn = document.querySelector(`.fixbtn${index}`);
  const valueDiv = document.querySelector(`.value${index} div`);
  const valueinputValue = document.querySelector(`.valueInput${index}`);

  if (updataBtn.innerText === "수정") {
    updataBtn.innerText = "수정완료";
    valueDiv.innerHTML = `<input class="valueInput${index}" type="number" value="${valueDiv.innerText}" required/>`;
  } else {
    valueDiv.innerText = valueinputValue.value;
    const update_data = alldata.map((item) => {
      if (Number(item.id) === index) {
        return {
          ...item,
          value: valueinputValue.value,
        };
      } else {
        return item;
      }
    });
    alldata = update_data;
    localStorage.setItem("chartdata", JSON.stringify(alldata));
    updataBtn.innerText = "수정";
    makeTable();
    loadToTextarea();
  }
};
// 삭제 기능
function deleteData(index) {
  if (confirm("정말 삭제하시겠습니까?")) {
    alldata = alldata.filter((item) => Number(item.id) !== index);
    localStorage.setItem("chartdata", JSON.stringify(alldata));
    makeTable();
    loadToTextarea();
  }
}

// 4. 값 고급 편집
const textarea = document.getElementById("chart-textarea");
const updateButton = document.getElementById("update-textarea");

// 텍스트에 로컬스토리지 데이터 보여주는 함수
function loadToTextarea() {
  const savedData = JSON.parse(localStorage.getItem("chartdata")) || [];
  textarea.value = JSON.stringify(savedData, null, 2);
}

// 수정 버튼 클릭하면 로컬스토리지 반영
updateButton.addEventListener("click", () => {
  try {
    const newData = JSON.parse(textarea.value);

    if (!Array.isArray(newData)) {
      alert("배열 형태로 입력해야 합니다.");
      return;
    }

    localStorage.setItem("chartdata", JSON.stringify(newData));

    makeTable();
    alert("수정 완료!");
  } catch (error) {
    alert("올바른 JSON 형식으로 작성해 주세요.");
    console.error(error);
  }
});

// 페이지 로드
window.addEventListener("load", loadToTextarea);
