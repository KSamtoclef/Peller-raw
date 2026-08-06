(()=>{'use strict';
const config=window.WHITE_WEDDING_CONFIG?.supabase;
function assertConfig(){
  if(!config?.url||!config?.anonKey||!config?.table)throw new Error('Supabase registration is not configured.');
}
async function request(path,options={}){
  assertConfig();
  const response=await fetch(`${config.url}/rest/v1/${path}`,{
    ...options,
    headers:{
      apikey:config.anonKey,
      Authorization:`Bearer ${config.anonKey}`,
      'Content-Type':'application/json',
      Prefer:'return=minimal',
      ...(options.headers||{})
    }
  });
  if(!response.ok){
    const detail=await response.text();
    throw new Error(detail||`Supabase request failed (${response.status})`);
  }
  return response;
}
window.PellerRegistration={
  async save(payload){
    const query=`${config.table}?on_conflict=registration_reference`;
    return request(query,{
      method:'POST',
      headers:{Prefer:'resolution=merge-duplicates,return=minimal'},
      body:JSON.stringify({...payload,updated_at:new Date().toISOString()})
    });
  },
  async updateNetwork(reference,mobileNetwork){
    if(!reference||!mobileNetwork)return;
    return request(`${config.table}?registration_reference=eq.${encodeURIComponent(reference)}`,{
      method:'PATCH',
      body:JSON.stringify({mobile_network:mobileNetwork,updated_at:new Date().toISOString()})
    });
  }
};
})();
