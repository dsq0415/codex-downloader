// ===== 配置 =====
// 改密码只改这里
const CODES = ["112233"];

// 下载链接（agentsmirror CDN，国内自动走中科院镜像加速）
const LINKS = {
  codex: {
    win: "https://codexapp.agentsmirror.com/latest/win-x64",
    macArm: "https://codexapp.agentsmirror.com/latest/mac-arm64",
    macIntel: "https://codexapp.agentsmirror.com/latest/mac-intel",
  },
  manager: {
    win: "https://codexapp.agentsmirror.com/manager/latest/CodexAppManager_x64-setup.exe",
    macArm: "https://codexapp.agentsmirror.com/manager/latest/CodexAppManager_aarch64.dmg",
    macIntel: "https://codexapp.agentsmirror.com/manager/latest/CodexAppManager_x86_64.dmg",
  },
  ccSwitch: {
    win: "https://dl.ccswitch.io/v3.19.2/CC-Switch-v3.19.2-Windows.msi",
    mac: "https://dl.ccswitch.io/v3.19.2/CC-Switch-v3.19.2-macOS.dmg",
  },
};

// ===== 系统检测 =====
const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

// ===== DOM =====
const codeArea = document.getElementById("code-area");
const codeInput = document.getElementById("code-input");
const codeBtn = document.getElementById("code-btn");
const codeError = document.getElementById("code-error");
const downloadSection = document.getElementById("download-section");
const osHint = document.getElementById("os-hint");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");
const modalConfirm = document.getElementById("modal-confirm");
const cardDownload = document.getElementById("card-download");
const cardTutorial = document.getElementById("card-tutorial");

// ===== 验证逻辑 =====
function checkSaved() {
  const saved = localStorage.getItem("codex_verified");
  if (saved && Date.now() - Number(saved) < 7 * 24 * 3600 * 1000) {
    unlock();
  }
}

function verify() {
  const val = codeInput.value.trim().toLowerCase();
  if (CODES.some((c) => c.toLowerCase() === val)) {
    localStorage.setItem("codex_verified", Date.now().toString());
    codeError.hidden = true;
    codeInput.classList.remove("error");
    unlock();
  } else {
    codeError.hidden = false;
    codeInput.classList.add("error");
  }
}

function unlock() {
  // 隐藏验证码区域
  codeArea.hidden = true;

  // 更新卡片状态
  cardDownload.classList.remove("card-locked");
  cardDownload.classList.add("card-active");
  cardDownload.querySelector(".card-desc").textContent = "✅ 已解锁，看下方";
  cardDownload.style.cursor = "pointer";
  cardDownload.addEventListener("click", () => {
    document.getElementById("dl-codex-main").click();
  });

  cardTutorial.classList.remove("card-locked");
  cardTutorial.classList.add("card-active");
  cardTutorial.querySelector(".card-desc").textContent = "✅ 已解锁，点击查看";
  cardTutorial.style.cursor = "pointer";
  cardTutorial.addEventListener("click", () => {
    window.open("https://codexguide.ai/", "_blank");
  });

  // 显示下载区和教程区
  downloadSection.hidden = false;
  document.getElementById("tutorial-section").hidden = false;
  setupDownloadButtons();
}

// ===== 下载按钮配置 =====
function setupDownloadButtons() {
  const codexMain = document.getElementById("dl-codex-main");
  const codexSub = document.getElementById("dl-codex-sub");
  const codexSub2 = document.getElementById("dl-codex-sub2");
  const mgrMain = document.getElementById("dl-manager-main");
  const mgrSub = document.getElementById("dl-manager-sub");
  const mgrSub2 = document.getElementById("dl-manager-sub2");
  const ccMain = document.getElementById("dl-ccswitch-main");
  const ccSub = document.getElementById("dl-ccswitch-sub");
  const ccTutorial = document.getElementById("ccswitch-tutorial");

  if (isMac) {
    osHint.innerHTML = "✅ 检测到你的电脑是 <strong>Mac</strong>（检测错了？每个安装包下面都有 Windows 版，直接点就行）";

    codexMain.textContent = "Mac 版下载";
    codexMain.href = LINKS.codex.macArm;
    codexSub.textContent = "Windows 版点这里";
    codexSub.href = LINKS.codex.win;
    codexSub2.hidden = false;
    codexSub2.textContent = "Intel Mac 点这个";
    codexSub2.href = LINKS.codex.macIntel;

    mgrMain.textContent = "Mac 版下载";
    mgrMain.href = LINKS.manager.macArm;
    mgrSub.textContent = "Windows 版点这里";
    mgrSub.href = LINKS.manager.win;
    mgrSub2.hidden = false;
    mgrSub2.textContent = "Intel Mac 点这个";
    mgrSub2.href = LINKS.manager.macIntel;

    ccMain.textContent = "Mac 版下载";
    ccMain.href = LINKS.ccSwitch.mac;
    ccSub.textContent = "Windows 版点这里";
    ccSub.href = LINKS.ccSwitch.win;
  } else {
    osHint.innerHTML = "✅ 检测到你的电脑是 <strong>Windows</strong>（检测错了？每个安装包下面都有 Mac 版，直接点就行）";

    codexMain.textContent = "Windows 版下载";
    codexMain.href = LINKS.codex.win;
    codexSub.textContent = "Mac 版点这里";
    codexSub.href = LINKS.codex.macArm;

    mgrMain.textContent = "Windows 版下载";
    mgrMain.href = LINKS.manager.win;
    mgrSub.textContent = "Mac 版点这里";
    mgrSub.href = LINKS.manager.macArm;

    ccMain.textContent = "Windows 版下载";
    ccMain.href = LINKS.ccSwitch.win;
    ccSub.textContent = "Mac 版点这里";
    ccSub.href = LINKS.ccSwitch.mac;
  }

  // 绑定弹窗
  [codexMain, codexSub, codexSub2, mgrMain, mgrSub, mgrSub2].forEach((btn) => {
    btn.addEventListener("click", () => {
      setTimeout(() => showModal(), 300);
    });
  });

  [ccMain, ccSub].forEach((btn) => {
    btn.addEventListener("click", () => {
      ccTutorial.hidden = false;
    });
  });
}

// ===== 弹窗 =====
function showModal() {
  modal.hidden = false;
}

function hideModal() {
  modal.hidden = true;
}

modalClose.addEventListener("click", hideModal);
modalConfirm.addEventListener("click", hideModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) hideModal();
});

// ===== 事件绑定 =====
codeBtn.addEventListener("click", verify);
codeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") verify();
});

// ===== 初始化 =====
checkSaved();
