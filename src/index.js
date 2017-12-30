
import VtexMasterdata from './class/VtexMasterdata.js';

if ( typeof (window.VtexMasterdata) === 'undefined' ) {
    window.VtexMasterdata = VtexMasterdata;
}

// Test Init
document.addEventListener('DOMContentLoaded', () => {
    const masterdata = new VtexMasterdata('store-name');
});
