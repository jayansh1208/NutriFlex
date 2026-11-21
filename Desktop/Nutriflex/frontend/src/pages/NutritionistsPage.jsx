import { useEffect,useMemo,useState } from 'react';
import { Link } from 'react-router-dom';
import { Search,UserRound,ArrowUpRight } from 'lucide-react';
import api from '../services/api';

const portraitFallbacks=[
 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=85',
 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=85',
 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=85',
];

export default function NutritionistsPage(){
 const [people,setPeople]=useState([]),[query,setQuery]=useState(''),[specialty,setSpecialty]=useState('All specialties'),[error,setError]=useState('');
 useEffect(()=>{api.get('/nutritionists/').then(r=>setPeople(r.data)).catch(()=>setError('Nutritionist profiles are temporarily unavailable.'));},[]);
 const specialties=['All specialties',...new Set(people.map(n=>n.specialization).filter(Boolean))];const shown=useMemo(()=>people.filter(n=>(`${n.name} ${n.qualification} ${n.specialization}`).toLowerCase().includes(query.toLowerCase())&&(specialty==='All specialties'||n.specialization===specialty)),[people,query,specialty]);
 return <div className="nf-directory"><div className="nf-eyebrow">PERSONALIZED EXPERT SUPPORT</div><h1>Find a nutritionist who gets you.</h1><p className="nf-muted">Thoughtful guidance for your everyday food and wellness goals.</p><div className="nf-directory-filters"><label><Search size={16}/><input placeholder="Search name or expertise" value={query} onChange={e=>setQuery(e.target.value)}/></label><select value={specialty} onChange={e=>setSpecialty(e.target.value)}>{specialties.map(s=><option key={s}>{s}</option>)}</select></div>{error&&<p className="nf-error">{error}</p>}<div className="nf-directory-grid">{shown.map((n,index)=><article className="nf-directory-card" key={n.id}><img className="nf-directory-photo" src={n.image_url||portraitFallbacks[index%portraitFallbacks.length]} alt={n.name} loading="lazy"/><div className="nf-nutri-meta">{n.specialization||'Nutrition & wellbeing'}</div><h2>{n.name}</h2><p>{n.qualification}</p><div className="nf-nutri-detail"><span>{n.experience_years||0}+ years experience</span><b>{Number(n.consultation_fee)>0?`₹${Number(n.consultation_fee).toLocaleString('en-IN')}`:'Fee on request'}</b></div><Link to={`/nutritionists/${n.slug||n.id}`} className="nf-directory-link">View profile <ArrowUpRight size={15}/></Link></article>)}</div>{!shown.length&&!error&&<div className="nf-empty"><UserRound/><strong>No profiles match that search</strong><span>Try a different name or specialty.</span></div>}</div>
}
