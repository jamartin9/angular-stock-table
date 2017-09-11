import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { MdSort, PageEvent, MdPaginator } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  displayedColumns = ['name', 'symbol', 'price', 'net'];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  ngOnInit() {
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
         .debounceTime(150)
         .distinctUntilChanged()
         .subscribe(() => {
           if (!this.dataSource) { return; }
           this.dataSource.filter = this.filter.nativeElement.value;
         });

  }

}

/** Constants used to fill up our data base. */
const COLORS = ['red', 'green', 'black'];
const NAMES = ['Apple', 'Google', 'RedHat', 'FaceBook', 'Sprint', 'AT&T',
  'Aetna', 'BiPolar', 'Netflix', 'Merica', 'Pandora', 'Baby',
  'Disney', 'MicroSoft', 'County', 'Airlines', 'Verizon', 'WallMart', 'GroupOn'];
const SYMBOLS = ['AAPL', 'GOOG', 'RTN', 'FB', 'S', 'T',
  'AET', 'BP', 'NFLX', 'AOBC', 'P', 'BABA',
  'DIS', 'MSFT', 'CCNE', 'AAL', 'VZ', 'WMT', 'GRPN'];

export interface UserData {
  name: string;
  symbol: string;
  price: number;
  net: number;
  color: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] { return this.dataChange.value; }

  constructor() {
    // Fill up the database with 100 users.
    for (let i = 0; i < 100; i++) { this.addRecord(); }
  }

  /** Adds a new user to the database. */
  addRecord() {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewRecord());
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewRecord() {
    const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))];
    const symbol =
      SYMBOLS[Math.round(Math.random() * (SYMBOLS.length - 1))];
    const price = Number(Math.round(Math.random() * 100).toString() + "." + Math.round(Math.random() * 100).toString());
    const net = Number(Math.round(Math.random() * 100).toString() + "." + Math.round(Math.random() * 100).toString());
    return {
      name: name,
      symbol: symbol,
      price: price,
      net: net,
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
   _filterChange = new BehaviorSubject('');
   get filter(): string { return this._filterChange.value; }
   set filter(filter: string) { this._filterChange.next(filter); }

  constructor(private _exampleDatabase: ExampleDatabase, private _sort: MdSort, private _paginator: MdPaginator) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserData[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.mdSortChange,
      this._paginator.page,
      this._filterChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() { }

  /** Returns a sorted copy of the database data. */
  getSortedData(): UserData[] {
    const data = this._exampleDatabase.data.slice();
    const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
    return data.filter((item: UserData) => {
      // TODO: change to userid hash
        let searchStr = (item.name).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      }).sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      let propertyC: number | string = '';
      let propertyD: number | string = '';


      switch (this._sort.active) {
        case 'name': {
          [propertyA, propertyB] = [a.name, b.name]; let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          let valueB = isNaN(+propertyB) ? propertyB : +propertyB;
          return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
        }
        case 'symbol': {
          [propertyA, propertyB] = [a.symbol, b.symbol]; let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          let valueB = isNaN(+propertyB) ? propertyB : +propertyB;
          return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
        }
        case 'price': {
          [propertyA, propertyB] = [a.price, b.price]; let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          let valueB = isNaN(+propertyB) ? propertyB : +propertyB;
          return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
        }
        case 'net': {
          [propertyA, propertyB, propertyC, propertyD] = [a.color, b.color, a.net, b.net];
          let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          let valueB = isNaN(+propertyB) ? propertyB : +propertyB;
          let valueC = isNaN(+propertyC) ? propertyC : +propertyC;
          let valueD = isNaN(+propertyD) ? propertyD : +propertyD;
          if (a.color == b.color) {
            let netSort = (valueC < valueD ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
            return netSort;
          } else {
            let colorSort = (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
            return colorSort;
          }
        }
      }

    }).splice(startIndex, this._paginator.pageSize);
  }
}
