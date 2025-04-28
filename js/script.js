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

// 테이블 생성하는 함수
const makeTable = () => {
  alldata = JSON.parse(localStorage.getItem("chartdata")) || [];

  const chartTable = document.querySelector(".chart-tbody");
  chartTable.innerHTML = alldata
    .map((x, i) => {
      return `<tr id="tr${x.id}">
                <td class="years${x.id} tdsize3">
                    <div>${x.id}</div>
                    <span></span>
                </td>
                <td class="years${x.id} tdsize3">
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
};

// input 값 저장하는 함수
function save() {
  let newData = { id: input1.value, value: input2.value };
  alldata.push(newData);
  localStorage.setItem("chartdata", JSON.stringify(alldata));
  makeTable();
  resetinput();
}

function resetinput() {
  input1.value = "";
  input2.value = "";
}

// 삭제 기능
function deleteData(index) {
  if (confirm("정말 삭제하시겠습니까?")) {
    alldata.splice(index, 1);
    localStorage.setItem("chartdata", JSON.stringify(alldata));
    makeTable();
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
