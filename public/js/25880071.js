const SUPABASE_URL = window.__ENV__?.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.__ENV__?.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase config. Create .env.local and run npm run generate:env.",
  );
}

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function renderView(templateId, viewId, data) {
  let source = document.querySelector(`#${templateId}`).innerHTML;
  let template = Handlebars.compile(source);
  document.querySelector(`#${viewId}`).innerHTML = template({ data });
}

function handleLogoutButton() {
  document.querySelectorAll(".logout-btn").forEach((btn) => {
    btn.onclick = async () => {
      try {
        await supabaseLogout();
      } catch (error) {
        alert("Logout Error: ${error.message}");
      }
    };
  });
}

(async function initPage() {
  handleLogoutButton();
})();
