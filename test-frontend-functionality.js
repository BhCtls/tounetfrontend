// 管理员功能测试脚本
// 在浏览器控制台中运行此脚本来测试各种功能

console.log('=== TouNetCore 管理员功能测试 ===');

// 测试用户管理功能
function testUserManagement() {
  console.log('1. 测试用户管理功能...');
  
  // 检查用户列表是否显示
  const userTable = document.querySelector('table tbody');
  if (userTable && userTable.children.length > 0) {
    console.log('✓ 用户列表正常显示');
  } else {
    console.log('✗ 用户列表未显示或为空');
  }
  
  // 检查创建用户按钮
  const createUserBtn = document.querySelector('button:contains("Create User")');
  if (createUserBtn) {
    console.log('✓ 创建用户按钮存在');
  } else {
    console.log('✗ 创建用户按钮不存在');
  }
  
  // 检查编辑和删除按钮
  const editButtons = document.querySelectorAll('button:contains("Edit")');
  const deleteButtons = document.querySelectorAll('svg[data-lucide="trash-2"]');
  console.log(`✓ 找到 ${editButtons.length} 个编辑按钮`);
  console.log(`✓ 找到 ${deleteButtons.length} 个删除按钮`);
}

// 测试应用程序管理功能
function testAppManagement() {
  console.log('2. 测试应用程序管理功能...');
  
  // 点击应用程序标签
  const appTab = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent.trim() === 'Applications'
  );
  
  if (appTab) {
    appTab.click();
    setTimeout(() => {
      // 检查应用程序卡片
      const appCards = document.querySelectorAll('[class*="Card"]');
      console.log(`✓ 找到 ${appCards.length} 个应用程序卡片`);
      
      // 检查启用/停用按钮
      const toggleButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
        btn.textContent.includes('Enable') || btn.textContent.includes('Disable')
      );
      console.log(`✓ 找到 ${toggleButtons.length} 个启用/停用按钮`);
      
      // 检查编辑和删除按钮
      const editButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
        btn.textContent.trim() === 'Edit'
      );
      const deleteButtons = document.querySelectorAll('svg[data-lucide="trash-2"]');
      console.log(`✓ 找到 ${editButtons.length} 个编辑按钮`);
      console.log(`✓ 找到 ${deleteButtons.length} 个删除按钮`);
    }, 500);
  } else {
    console.log('✗ 应用程序标签不存在');
  }
}

// 测试邀请码管理功能
function testInviteCodeManagement() {
  console.log('3. 测试邀请码管理功能...');
  
  // 点击邀请码标签
  const inviteTab = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent.trim() === 'Invite Codes'
  );
  
  if (inviteTab) {
    inviteTab.click();
    setTimeout(() => {
      // 检查邀请码表格
      const inviteTable = document.querySelector('table tbody');
      if (inviteTable && inviteTable.children.length > 0) {
        console.log('✓ 邀请码列表正常显示');
        
        // 检查复制和删除按钮
        const copyButtons = document.querySelectorAll('svg[data-lucide="copy"], svg[data-lucide="check"]');
        const deleteButtons = document.querySelectorAll('svg[data-lucide="trash-2"]');
        console.log(`✓ 找到 ${copyButtons.length} 个复制按钮`);
        console.log(`✓ 找到 ${deleteButtons.length} 个删除按钮`);
      } else {
        console.log('✗ 邀请码列表未显示或为空');
      }
      
      // 检查生成邀请码按钮
      const generateBtn = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Generate')
      );
      if (generateBtn) {
        console.log('✓ 生成邀请码按钮存在');
      } else {
        console.log('✗ 生成邀请码按钮不存在');
      }
    }, 500);
  } else {
    console.log('✗ 邀请码标签不存在');
  }
}

// 运行所有测试
function runAllTests() {
  console.log('开始运行管理员功能测试...');
  
  // 等待页面加载完成
  setTimeout(() => {
    testUserManagement();
    setTimeout(() => testAppManagement(), 1000);
    setTimeout(() => testInviteCodeManagement(), 2000);
    setTimeout(() => {
      console.log('=== 测试完成 ===');
      console.log('请检查以上输出结果，确保所有功能正常工作。');
    }, 3000);
  }, 1000);
}

// 自动运行测试
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAllTests);
} else {
  runAllTests();
}
