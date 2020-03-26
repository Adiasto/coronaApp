import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as M from 'materialize-css';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  coronaData;
  viewData;
  cities = [];
  nationalities = [];
  states = [];
  age = [];
  genders = [];
  statuses = [];
  countObj={};
  showDetails=false;
  totalCounts={};

  view={
    name:'State',
    value:'Detected state'
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get("http://ec2-15-206-178-149.ap-south-1.compute.amazonaws.com:3300/data").subscribe((data) => {
      this.coronaData = data;
      this.viewData = data;
      this.createFilter(data);
      this.filterTable();
      setTimeout(() => {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems);
      }, 1000);
    })
  }

  filter = {
    city: '',
    state: 'Maharashtra',
    gender: '',
    status: '',
    nationality: ''
  }

  filterMap = {
    city: 'Detected city',
    state: 'Detected state',
    gender: 'Gender',
    status: 'Current status',
    nationality: 'Nationality'
  }

  views={
    all:'state',
    state: 'city',
    city: '',
  }

  createFilter(data) {
    data.forEach(row => {
      if (!this.states.includes(row["Detected state"])) {
        this.states.push(row["Detected state"]);
      }
      // if (!this.nationalities.includes(row["Nationality"])) {
      //   this.nationalities.push(row["Nationality"]);
      // }
      // if (!this.genders.includes(row['Gender'])) {
      //   this.genders.push(row["Gender"]);
      // }
      // if (!this.statuses.includes(row['Current status']))
      //   this.statuses.push(row["Current status"]);
    });
  }

  viewDown(){}

  filterTable() {
    var viewData = [];
    this.coronaData.forEach(row => {
      let match = true;
      Object.keys(this.filter).forEach(query => {
        if (this.filter[query]) {
          if (row[this.filterMap[query]] != this.filter[query]) {
            match = false;
          }
        }
      })
      if (match)
        viewData.push(row);
    });
    this.cities=[];
    this.countObj=[];
    this.totalCounts={};
    viewData.forEach(row=>{
      if (!this.cities.includes(row["Detected city"])) {
        this.cities.push(row["Detected city"]);
        this.countObj[row["Detected city"]]={};
        this.countObj[row["Detected city"]][row['Current status']]=1;
      }
      else{
        if(this.countObj[row["Detected city"]][row['Current status']]){
          this.countObj[row["Detected city"]][row['Current status']]+=1;
        }else{
          this.countObj[row["Detected city"]][row['Current status']]=1;
        }
      }
      if(this.totalCounts[row['Current status']]){
        this.totalCounts[row['Current status']]+=1;
      }
      else{
        this.totalCounts[row['Current status']]=1;
      }
    })
    this.cities=Object.keys(this.countObj)
  }


}
