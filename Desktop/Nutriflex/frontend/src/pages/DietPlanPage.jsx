import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { Check,ChevronLeft,ChevronRight,Clock3,Leaf,Utensils } from 'lucide-react';
import api from '../services/api';

const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
export default function DietPlanPage(){
 const [plan,setPlan]=useState(null),[error,setError]=useState('');
 const load=()=>api.get('/diet/plan').then(r=>setPlan(r.data.data)).catch(e=>setError(e.response?.data?.message||'Could not load your meal plan.'));
 useEffect(()=>{load()},[]);
 const toggle=async meal=>{try{await api.patch(`/diet/meals/${meal.id}`,{completed:!meal.completed});setPlan({...plan,meals:plan.meals.map(m=>m.id===meal.id?{...m,completed:!m.completed}:m)});}catch{setError('Could not update this meal.')} };
 if(error&&!plan)return <div className="nf-onboard"><div className="nf-panel"><h2>Your plan is waiting</h2><p className="nf-muted">{error}</p><Link className="nf-button primary" to="/onboarding">Complete your profile</Link></div></div>;
 if(!plan)return <div className="nf-loading">Creating your weekly meal plan…</div>;
 const done=plan.meals.filter(m=>m.completed).length;
 return <div className="nf-dashboard nf-diet"><div className="nf-dash-head"><div><div className="nf-eyebrow">YOUR WEEKLY MEAL PLAN</div><h1>A little structure, made personal.</h1><p className="nf-muted">A flexible guide based on your {plan.dietary_preference||'food'} preferences and wellness goals.</p></div><Link to="/dashboard" className="nf-button secondary"><ChevronLeft size={16}/> Dashboard</Link></div><div className="nf-plan-progress"><span><Leaf size={16}/> {plan.goal||'Wellness'} · Week of {plan.week_start}</span><b>{done} of {plan.meals.length} meals checked off</b><div className="nf-progress"><i style={{width:`${Math.round(done/plan.meals.length*100)}%`}}/></div></div>{error&&<p className="nf-error">{error}</p>}<div className="nf-days-grid">{days.map((day,index)=>{const meals=plan.meals.filter(m=>m.weekday===index);return <section className="nf-panel nf-day-card" key={day}><div className="nf-day-head"><h2>{day}</h2><span>{meals.filter(m=>m.completed).length}/{meals.length}</span></div>{meals.map(m=><article key={m.id} className={`nf-plan-meal ${m.completed?'complete':''}`}><div className="nf-plan-type">{m.meal_type}</div><div className="nf-plan-main"><strong>{m.title}</strong><p>{m.description}</p><small><Utensils size={12}/> ~{m.calories} kcal <span>·</span> {m.protein}g protein</small></div><button aria-label={m.completed?'Mark meal not completed':'Mark meal completed'} onClick={()=>toggle(m)} className="nf-check">{m.completed?<Check size={15}/>:<span/>}</button></article>)}</section>})}</div><p className="nf-plan-note"><Clock3 size={14}/> Your meal plan is a general guide. Nutrition values are estimates; adapt portions to your needs.</p></div>
}
