import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const steps = ['About you', 'Your body', 'Food preferences', 'Your goals'];
const initial = { full_name: '', age: '', gender: '', height_cm: '', weight_kg: '', dietary_preference: '', allergies: '', food_restrictions: '', activity_level: '', goals: '' };

export default function OnboardingPage() {
  const [step, setStep] = useState(0); const [form, setForm] = useState(initial); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [existing,setExisting]=useState(false); const nav=useNavigate(); const {user}=useAuth();
  useEffect(()=>{api.get('/profile/').then(r=>{setExisting(true);setForm({...initial,...r.data.data,full_name:user?.full_name||''});}).catch(()=>{});},[user]);
  const update=(e)=>setForm({...form,[e.target.name]:e.target.value});
  const save=async(e)=>{e.preventDefault();setError('');if(step<3){setStep(step+1);return;}setBusy(true);try{const payload={...form,age:Number(form.age),height_cm:Number(form.height_cm),weight_kg:Number(form.weight_kg)};if(existing)await api.put('/profile/',payload);else await api.post('/profile/',payload);nav('/dashboard');}catch(err){setError(err.response?.data?.message||'Could not save your profile. Please check the details and try again.');}finally{setBusy(false);}};
  const field=(label,name,type='text',options=null,required=true)=><label className="nf-field">{label}{options?<select name={name} value={form[name]??''} onChange={update} required={required}><option value="">Choose one</option>{options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}</select>:<input name={name} type={type} value={form[name]??''} onChange={update} required={required} min={type==='number'?1:undefined}/>}</label>;
  return <div className="nf-onboard"><div className="nf-onboard-card"><div className="nf-eyebrow">LET'S GET TO KNOW YOU</div><h1>Your plan starts with you.</h1><p className="nf-muted">A few details help us make your wellness journey personal.</p><div className="nf-step-track">{steps.map((s,i)=><div key={s} className={`nf-step ${i<=step?'active':''}`}><span>{i<step?<Check size={14}/>:i+1}</span><small>{s}</small></div>)}</div><form onSubmit={save} className="nf-form-grid">
  {step===0&&<>{field('Full name','full_name')}{field('Age','age','number')}{field('Gender','gender','text',['Woman','Man','Non-binary','Prefer not to say'])}</>}
  {step===1&&<>{field('Height (cm)','height_cm','number')}{field('Current weight (kg)','weight_kg','number')}</>}
  {step===2&&<>{field('How do you eat?','dietary_preference','text',['Vegetarian','Vegan','Jain','Non-vegetarian'])}{field('Allergies','allergies','text',null,false)}{field('Other food restrictions','food_restrictions','text',null,false)}</>}
  {step===3&&<>{field('Activity level','activity_level','text',['Sedentary','Lightly active','Moderately active','Very active'])}{field('Your primary goal','goals','text',['Weight loss','Weight maintenance','Weight gain','General wellness'])}</>}
  {error&&<p className="nf-error nf-span">{error}</p>}<div className="nf-form-actions nf-span">{step>0&&<button type="button" className="nf-button secondary" onClick={()=>setStep(step-1)}><ArrowLeft size={16}/> Back</button>}<button className="nf-button primary" disabled={busy}>{busy?'Saving…':step===3?'Finish setup':'Continue'} {step===3?<Check size={16}/>:<ArrowRight size={16}/>}</button></div>
 </form></div></div>
}
