import Vue from 'vue';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';
import highchartsMore from 'highcharts/highcharts-more';
import solidgauge from 'highcharts/modules/solid-gauge';

highchartsMore(Highcharts);
solidgauge(Highcharts);

Vue.use(HighchartsVue);
