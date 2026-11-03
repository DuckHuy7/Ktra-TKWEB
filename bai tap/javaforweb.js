"use strict";

/* =========================
   DỮ LIỆU CHI TIẾT DỰ ÁN
========================= */

const projectData = {
  beer: {
    category: "UI/UX · DỰ ÁN HỌC TẬP",

    title: "Beer Hoàng Thành",

    description:
      "Chủ đề thiết kế website giới thiệu quán bia, xem thực đơn và đặt bàn trực tuyến.",

    features: [
      "Phân nhóm món ăn và đồ uống để người dùng dễ tìm kiếm.",
      "Thiết kế giao diện phù hợp cho máy tính và điện thoại.",
      "Phác thảo luồng chọn món và đặt bàn.",
      "Sử dụng màu vàng bia kết hợp màu xám."
    ],

    note:
      "Hình trên portfolio là minh họa bằng CSS. Bản thiết kế Figma và sản phẩm gốc chưa được liên kết trong phiên bản này."
  },

  portfolio: {
    category: "FRONT-END · FIT4014 A2.2",

    title: "Portfolio cá nhân",

    description:
      "Website bạn đang xem được xây dựng bằng HTML5, CSS3 và JavaScript thuần.",

    features: [
      "Giới thiệu bản thân, định hướng và kỹ năng đang học.",
      "Lọc các dự án theo nhóm UI/UX, Web và Hệ thống.",
      "Xem thông tin chi tiết dự án trong hộp thoại.",
      "In hoặc lưu CV bằng hộp thoại in của trình duyệt.",
      "Theo dõi checklist chuẩn bị bài kiểm tra A2.2."
    ],

    note:
      "Để hoàn tất bài kiểm tra, cần bổ sung tài liệu dự án, repository GitHub, URL GitHub Pages và Release thực tế."
  },

  system: {
    category: "PHÂN TÍCH HỆ THỐNG · DỰ ÁN HỌC TẬP",

    title: "Quản lý đoàn viên",

    description:
      "Chủ đề phân tích hệ thống quản lý hồ sơ đoàn viên và các hoạt động đoàn.",

    features: [
      "Xác định tác nhân và các nhóm chức năng chính.",
      "Mô tả use case và luồng xử lý nghiệp vụ.",
      "Mô hình hóa dữ liệu và quan hệ giữa các thực thể.",
      "Phân tích yêu cầu chức năng và phi chức năng."
    ],

    note:
      "Dashboard là hình minh họa. Portfolio này không chứa dữ liệu đoàn viên thật hoặc hệ thống quản trị đang hoạt động."
  }
};

/* =========================
   LỌC DỰ ÁN
========================= */

const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card");
const filterStatus = document.getElementById("filter-status");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedCategory = button.dataset.filter;

    // Cập nhật nút đang được chọn.
    filterButtons.forEach((item) => {
      const isActive = item === button;

      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    // Hiển thị dự án phù hợp.
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const matches =
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory;

      card.hidden = !matches;

      if (matches) {
        visibleCount += 1;
      }
    });

    // Thông báo cho trình đọc màn hình.
    filterStatus.textContent = `Hiển thị ${visibleCount} dự án.`;
  });
});

/* =========================
   HỘP THOẠI CHI TIẾT
========================= */

const projectDialog = document.getElementById("project-dialog");
const dialogCategory = document.getElementById("dialog-category");
const dialogTitle = document.getElementById("dialog-title");
const dialogDescription = document.getElementById("dialog-description");
const dialogFeatures = document.getElementById("dialog-features");
const dialogNote = document.getElementById("dialog-note");

const closeDialogButton = document.getElementById("close-dialog");
const confirmDialogButton = document.getElementById("confirm-dialog");

let lastProjectButton = null;

function openProjectDialog(projectKey, triggerButton) {
  const project = projectData[projectKey];

  if (!project) {
    return;
  }

  lastProjectButton = triggerButton;

  dialogCategory.textContent = project.category;
  dialogTitle.textContent = project.title;
  dialogDescription.textContent = project.description;
  dialogNote.textContent = project.note;

  // Tạo phần tử bằng DOM để nội dung được hiển thị dạng văn bản.
  const featureElements = project.features.map((feature) => {
    const listItem = document.createElement("li");

    listItem.textContent = feature;

    return listItem;
  });

  dialogFeatures.replaceChildren(...featureElements);

  projectDialog.showModal();
  document.body.classList.add("modal-open");
}

function closeProjectDialog() {
  projectDialog.close();
}

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    openProjectDialog(button.dataset.project, button);
  });
});

closeDialogButton.addEventListener("click", closeProjectDialog);
confirmDialogButton.addEventListener("click", closeProjectDialog);

// Đóng khi bấm vào vùng nền bên ngoài hộp thoại.
projectDialog.addEventListener("click", (event) => {
  if (event.target !== projectDialog) {
    return;
  }

  const rect = projectDialog.getBoundingClientRect();

  const clickedOutside =
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom;

  if (clickedOutside) {
    closeProjectDialog();
  }
});

// Sự kiện close cũng chạy khi người dùng nhấn Escape.
projectDialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");

  if (lastProjectButton) {
    lastProjectButton.focus();
  }
});

/* =========================
   IN / LƯU CV
========================= */

const printButton = document.getElementById("print-button");

printButton.addEventListener("click", () => {
  window.print();
});

/* =========================
   LƯU CHECKLIST
========================= */

const checklistInputs = document.querySelectorAll("[data-check]");
const storagePrefix = "huy-portfolio-a22-";

checklistInputs.forEach((checkbox) => {
  const storageKey = storagePrefix + checkbox.dataset.check;

  // Đọc trạng thái đã lưu.
  try {
    checkbox.checked = localStorage.getItem(storageKey) === "true";
  } catch {
    // Checklist vẫn sử dụng được nếu trình duyệt chặn localStorage.
  }

  // Lưu trạng thái mới.
  checkbox.addEventListener("change", () => {
    try {
      localStorage.setItem(storageKey, String(checkbox.checked));
    } catch {
      // Không làm gián đoạn giao diện khi không thể lưu.
    }
  });
});