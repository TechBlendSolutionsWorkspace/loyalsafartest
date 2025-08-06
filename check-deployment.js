// Simple deployment checker
const url = 'https://2fb2743f-eaa9-440a-b30c-a16762290386-00-18265rw80vaxl.janeway.replit.dev';

async function checkDeployment() {
  console.log('🔍 Checking deployment status...');
  
  try {
    // Check main page
    console.log('📄 Checking main page...');
    const mainResponse = await fetch(url);
    const mainHtml = await mainResponse.text();
    console.log('✅ Main page loads:', mainHtml.includes('<div id="root">'));
    
    // Check if it's just HTML or if JavaScript is running
    if (mainHtml.includes('<div id="root"></div>')) {
      console.log('⚠️  React app not rendering - JavaScript issue detected');
    } else {
      console.log('✅ React app appears to be rendering');
    }
    
    // Check API endpoints
    console.log('🔌 Checking API endpoints...');
    
    const healthResponse = await fetch(`${url}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    const categoriesResponse = await fetch(`${url}/api/categories`);
    const categoriesData = await categoriesResponse.json();
    console.log('✅ Categories:', categoriesData.length, 'found');
    
    const productsResponse = await fetch(`${url}/api/products`);
    const productsData = await productsResponse.json();
    console.log('✅ Products:', productsData.length, 'found');
    
    // Check static assets
    console.log('📦 Checking static assets...');
    const jsResponse = await fetch(`${url}/assets/index-1j4Ajsri.js`);
    console.log('✅ JavaScript file:', jsResponse.status === 200 ? 'OK' : 'FAILED');
    
    const cssResponse = await fetch(`${url}/assets/index-ofyNwkGt.css`);
    console.log('✅ CSS file:', cssResponse.status === 200 ? 'OK' : 'FAILED');
    
    console.log('\n🎯 DIAGNOSIS:');
    if (healthData && categoriesData.length > 0 && productsData.length > 0) {
      console.log('✅ Backend is working perfectly');
      console.log('✅ Database has all data');
      console.log('✅ APIs are responding correctly');
      
      if (jsResponse.status === 200 && cssResponse.status === 200) {
        console.log('✅ Static assets are served correctly');
        console.log('❓ Issue is likely with React app initialization');
        console.log('🔧 Solution: Check console errors in browser');
      } else {
        console.log('❌ Static assets not loading properly');
      }
    } else {
      console.log('❌ Backend issues detected');
    }
    
  } catch (error) {
    console.error('❌ Deployment check failed:', error.message);
  }
}

checkDeployment();