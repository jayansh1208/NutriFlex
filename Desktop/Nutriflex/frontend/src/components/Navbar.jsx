import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open,setOpen]=useState(false); const {user,logout}=useAuth();
  const links=[['/about','About'],['/features','Features'],['/nutritionists','Nutritionists'],['/hub','Educational Hub'],['/pricing','Pricing']];
  const navLink=([to,label])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>`nf-nav-link ${isActive?'active':''}`}>{label}</NavLink>;
  return <header className="nf-header"><nav className="nf-nav"><Link to="/" className="nf-brand"><span><Leaf size={18}/></span><b>Nutri<span>Flex</span></b></Link><div className={`nf-nav-links ${open?'open':''}`}>{links.map(navLink)}<NavLink to="/contact" onClick={()=>setOpen(false)} className="nf-nav-link">Contact</NavLink>{user?<><NavLink to="/dashboard" onClick={()=>setOpen(false)} className="nf-nav-link">My dashboard</NavLink>{user.role==='admin'&&<NavLink to="/admin" onClick={()=>setOpen(false)} className="nf-nav-link">Admin</NavLink>}<button className="nf-nav-cta" onClick={()=>{setOpen(false);logout();}}>Sign out</button></>:<><NavLink to="/login" onClick={()=>setOpen(false)} className="nf-nav-link">Log in</NavLink><Link onClick={()=>setOpen(false)} to="/register" className="nf-nav-cta">Get started <span>↗</span></Link></>}</div><button className="nf-menu-toggle" aria-label={open?'Close menu':'Open menu'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></nav></header>
}
