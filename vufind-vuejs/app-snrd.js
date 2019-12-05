Vue.component('paginate', VuejsPaginate);
Vue.config.silent = false;
Vue.config.devtools = true;

const conf = {
  facets: {
    'reponame_str':'Repository',
    'topic_facet':'Topics', 
    'format':'Format'
  },
  apiurl:'http://www.lareferencia.info/vufind/api/v1/search',
  urlrecords:'http://www.lareferencia.info/vufind/Record/'
};
//
/*
other s
'http://repositoriosdigitales.mincyt.gob.ar/vufind/api/v1/search' https://bibliotecas.uncuyo.edu.ar/explorador3/api/v1/search 
 'http://repositoriosdigitales.mincyt.gob.ar/vufind/Record/' // 'http://www.lareferencia.info/vufind/Record/' ,
*/ 

var app = new Vue({
  el: '#app',

  data() {
    return {
      buscar: '',
      pagination: 'pagination',
      prev: "<<",
      next: ">>",
      pagecount: 0,
      loading: false,
      found: 0,
      respuesta: [],
      records: [],
      errorencarga: false,
      facets: [],
      filters: [],
      titfilters: [],
      facettitles: conf.facets, // Object.values(conf.facets)
      filtrosextras:false ,
      propias:false,
      page:1,
      urlrecords:conf.urlrecords 
    }
  },
  methods: {
    showmore: function (e, que) {
      $(e.target).toggle();
      $('.' + que).toggle('slow');

    }
    ,
    delfilter: function (indexfilter) {
      this.filters = arrremove(this.filters, indexfilter);
      this.titfilters = arrremove(this.titfilters, indexfilter);
      this.dbuscar(0);
    },
    changepage: function (page) {
      this.page=page;
      this.dbuscar(page);

    },
    addfilter: function (value, field) {

      let k = conf.facets[field] + ":" + value;
      let v = field + ": " + value;

      this.filters.push(v);
      this.titfilters.push(k);
      this.dbuscar();


    },
    dbuscar: function (page) {
      this.loading = true;
      //bibliotecas.uncu.edu.ar/explorador3 //localhost/vufind
      //const url = 'https://bibliotecas.uncuyo.edu.ar/explorador3/api/v1/search';
      
      


      // let filtros = this.filter; 
      //this.filters.push('recordtype:thesis') ; 
      axios.get(conf.apiurl,
        {
          crossDomain: true,
          params:
            {
              lookfor: this.buscar,
              filter: this.filters,
              facet: Object.keys(conf.facets),
              field: ['id', 'primaryAuthors',
                'rawData',
                'secondaryAuthors', 'title', 'subjects', 'formats', 'humanReadablePublicationDates'],
              type: 'AllFields', sort: 'relevance', page: page, limit: 20, prettyPrint: false, lng: 'es'
            }
        }
      )
        .then((response) => {
          this.errorencarga = false;
          this.respuesta = response.data;
          this.loading = false;
          this.found = response.data.resultCount;
          if (this.found == 0) {
            this.records = [];
            this.facets = [];
            this.pagecount = 0;
            alert('Nada encontrado con el filtro usado');
          }
          else {
            this.records = response.data.records;
            this.facets = response.data.facets;
            //console.table(this.facets);
            this.pagecount = Math.floor(response.data.resultCount / 20);
          }

        })
        .catch((error) => {
          this.errorencarga = true;
        });
    }
  }
})



function arrremove(arrOriginal, elementToRemove) {
  return arrOriginal.filter(function (i, el) { return el !== elementToRemove });
}