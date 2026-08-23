import { mount } from 'svelte';
import App from './App.svelte';
import { installCuratedChecklistHost } from './lib/curated-checklist-host';
import './styles.css';

const target = document.getElementById('app')!;
mount(App, { target });
installCuratedChecklistHost(target);
