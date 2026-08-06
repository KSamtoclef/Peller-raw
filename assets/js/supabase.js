(()=>{'use strict';
const config=window.WHITE_WEDDING_CONFIG?.supabase;
function assertConfig(){
  if(!config?.url||!config?.anonKey||!config?.table)throw new Error('Supabase registration is not configured.');
}
async function request(path,options={}){
  assertConfig();
  let response;
  try{
    response=await fetch(`${config.url}/rest/v1/${path}`,{
      ...options,
      headers:{
        apikey:config.anonKey,
        Authorization:`Bearer ${config.anonKey}`,
        'Content-Type':'application/json',
        Prefer:'return=minimal',
        ...(options.headers||{})
      }
    });
  }catch(error){
    throw new Error('Network request to Supabase failed.');
  }
  if(!response.ok){
    const detail=await response.text();
    const error=new Error(detail||`Supabase request failed (${response.status})`);
    error.status=response.status;
    throw error;
  }
  return response;
}
window.PellerRegistration={
  async save(payload){
    try{
      return await request(config.table,{
        method:'POST',
        body:JSON.stringify({...payload,updated_at:new Date().toISOString()})
      });
    }catch(error){
      if(error.status===409||String(error.message).includes('23505')){
        return request(`${config.table}?registration_reference=eq.${encodeURIComponent(payload.registration_reference)}`,{
          method:'PATCH',
          body:JSON.stringify({...payload,updated_at:new Date().toISOString()})
        });
      }
      throw error;
    }
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
