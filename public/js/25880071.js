const SUPABASE_URL = "https://mceppsaopubbcqfwyqbi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_3s1D7xmTO7VpPc-Blwybxg_LQXg2EeD";

const { createClient } = supabase;
const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


function renderView(templateId, viewId, data) {
    let source = document.querySelector(`#${templateId}`).innerHTML;
    let template = Handlebars.compile(source);
    document.querySelector(`#${viewId}`).innerHTML = template({ data });
}