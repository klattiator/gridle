import { describe, it } from 'mocha';
import { expect } from 'chai';
import gridl from '../../src';

describe('area', () => {

    const mockData = () => [
        [0,7,3,2,8,4,8],
        [4,2,5,7,8,4,8],
        [6,6,6,6,7,4,8],
        [6,6,6,6,7,4,8],
        [6,5,1,6,9,2,7],
    ];

    it('should provide an area function', () => {
        expect(typeof gridl(mockData()).area).to.equal('function');
    });

    describe('validation', () => {

        it('should throw an error if column is invalid', () => {
            const operation = () => gridl(mockData()).area(['d',1]);
            expect(operation).to.throw('Invalid area description: column is not a number');
        });

        it('should throw an error if column is negative', () => {
            const operation = () => gridl(mockData()).area([-1]);
            expect(operation).to.throw('Invalid area description: columns cannot be negative');
        });

        it('should throw an error if row is invalid', () => {
            const operation = () => gridl(mockData()).area([1,{}]);
            expect(operation).to.throw('Invalid area description: row is not a number');
        });

        it('should throw an error if row is negative', () => {
            const operation = () => gridl(mockData()).area([1,-1]);
            expect(operation).to.throw('Invalid area description: rows cannot be negative');
        });

        it('should throw an error if x is invalid', () => {
            const operation = () => gridl(mockData()).area([1,2,() => {}]);
            expect(operation).to.throw('Invalid area description: x is not a number');
        });

        it('should throw an error if y is invalid', () => {
            const operation = () => gridl(mockData()).area([0,0,1,'y']);
            expect(operation).to.throw('Invalid area description: y is not a number');
        });

        it('should throw an error if ax is invalid', () => {
            const operation = () => gridl(mockData()).area([0,0,0,0,'y']);
            expect(operation).to.throw('Invalid area description: anchorX is not a number');
        });

        it('should throw an error if ay is invalid', () => {
            const operation = () => gridl(mockData()).area([0,0,0,0,0,'y']);
            expect(operation).to.throw('Invalid area description: anchorY is not a number');
        });

        // TODO: test area description validation

    });

    describe('numColumns', () => {

        it('should return the default number of 0', () => {
            const data = mockData();
            const area = gridl(data).area([]);
            expect(area.numColumns()).to.deep.equal(0);
        });

        it('should return the number of columns', () => {
            const data = mockData();
            const area = gridl(data).area([1,2,4,3]);
            expect(area.numColumns()).to.deep.equal(1);
        });

    });

    describe('numRows', () => {

        it('should return the default number of 0', () => {
            const data = mockData();
            const area = gridl(data).area([1]);
            expect(area.numRows()).to.deep.equal(0);
        });

        it('should return the number of rows', () => {
            const data = mockData();
            const area = gridl(data).area([1,2,4,3]);
            expect(area.numRows()).to.deep.equal(2);
        });

    });

    describe('size', () => {

        it('should return the default number of 0', () => {
            const data = mockData();
            const area = gridl(data).area([]);
            expect(area.size()).to.deep.equal([0, 0]);
        });

        it('should return the number of rows', () => {
            const data = mockData();
            const area = gridl(data).area([1,2,4,3]);
            expect(area.size()).to.deep.equal([1, 2]);
        });

    });

    describe('position', () => {

        it('should return the default position of [0,0]', () => {
            const data = mockData();
            const area = gridl(data).area([1,2]);
            expect(area.position()).to.deep.equal([0, 0]);
        });

        it('should return the position', () => {
            const data = mockData();
            const area = gridl(data).area([0,0,4,3]);
            expect(area.position()).to.deep.equal([4, 3]);
        });

        it('should return a position outside the grid', () => {
            const data = mockData();
            const area = gridl(data).area([0,0,10,20]);
            expect(area.position()).to.deep.equal([10, 20]);
        });

    });

    describe('anchor', () => {

        it('should return the default anchor of [0,0]', () => {
            const data = mockData();
            const area = gridl(data).area([1,2,4,3]);
            expect(area.anchor()).to.deep.equal([0, 0]);
        });

        it('should return the anchor', () => {
            const data = mockData();
            const area = gridl(data).area([0,0,4,3,1,2]);
            expect(area.anchor()).to.deep.equal([1, 2]);
        });

        it('should return a negative anchor', () => {
            const data = mockData();
            const area = gridl(data).area([0,0,4,3,-1,-2]);
            expect(area.anchor()).to.deep.equal([-1, -2]);
        });

    });

    describe('valueAt (as getter)', () => {

        it('should get the value at a local position, with area positioned at [0,0]', () => {
            const grid = gridl(mockData());
            const result = grid.area([4,3]).valueAt([2,1]);
            expect(result).to.equal(5);
        });

        it('should throw an error when using an invalid position', () => {
            const g = gridl(mockData());
            const errorMsgBase = 'Trying to access value at an invalid position: ';
            expect(() => g.valueAt('blub')).to.throw(errorMsgBase + 'blub');
            expect(() => g.valueAt({})).to.throw(errorMsgBase + '[object Object]');
            expect(() => g.valueAt(undefined)).to.throw(errorMsgBase + 'undefined');
        });

    });

    describe('valueAt (as setter)', () => {

        it('should get the value at a local position, with area positioned at [0,0]', () => {
            const grid = gridl(mockData());
            const localPos = [2,1];
            const area = grid.area([4,3]);
            const result = area
                .valueAt(localPos, 666)
                .valueAt(localPos);
            expect(result).to.equal(666);
        });

        it('should throw an error when using an invalid position', () => {
            const g = gridl(mockData());
            const value = 666;
            const errorMsgBase = 'Trying to access value at an invalid position: ';
            expect(() => g.valueAt('blub', value)).to.throw(errorMsgBase + 'blub');
            expect(() => g.valueAt({}, value)).to.throw(errorMsgBase + '[object Object]');
            expect(() => g.valueAt(undefined, value)).to.throw(errorMsgBase + 'undefined');
        });

    });

    describe('data (as getter)', () => {

        it('should return the data of the area as 2d array', () => {
            expect(gridl(mockData()).area([2,3,1,2]).data()).to.deep.equal([
                [6,6],
                [6,6],
                [5,1],
            ]);
        });

        it('should work with one row and no column', () => {
            const area = gridl(mockData()).area([0,1,1,2]);
            expect(area.numRows()).to.equal(1);
            expect(area.numColumns()).to.equal(0);
            expect(area.data()).to.deep.equal([[]]);
        });

        it('should work with no row and no column', () => {
            const area = gridl(mockData()).area([0,0,1,2]);
            expect(area.numRows()).to.equal(0);
            expect(area.numColumns()).to.equal(0);
            expect(area.size()).to.deep.equal([0,0]);
            expect(area.data()).to.deep.equal([]);
        });

        it('should work with an anchor at the point of origin', () => {
            const area = gridl(mockData()).area([3,3,0,0,1,2]);
            expect(area.numRows()).to.equal(1);
            expect(area.numColumns()).to.equal(2);
            expect(area.data()).to.deep.equal([
                [0,7],
            ]);
        });

        it('should work with an anchor at a custom position', () => {
            const area = gridl(mockData()).area([3,3,2,4,1,2]);
            expect(area.numRows()).to.equal(3);
            expect(area.numColumns()).to.equal(3);
            expect(area.size()).to.deep.equal([3,3]);
            expect(area.data()).to.deep.equal([
                [6,6,6],
                [6,6,6],
                [5,1,6],
            ]);
        });

        it('should crop areas that are greater than the grid', () => {
            const area = gridl(mockData()).area([8,9]);
            expect(area.numRows()).to.equal(5);
            expect(area.numColumns()).to.equal(7);
            expect(area.data()).to.deep.equal(mockData());
        });

        it('should crop areas that are greater than the grid by using an anchor', () => {
            const area = gridl(mockData()).area([10,10,0,0,1,2]);
            expect(area.numRows()).to.equal(5);
            expect(area.numColumns()).to.equal(7);
            expect(area.data()).to.deep.equal(mockData());
        });

        it('should crop areas that goes beyond the grid', () => {
            const area = gridl(mockData()).area([6,8,6,3,2,1]);
            expect(area.numRows()).to.equal(3);
            expect(area.numColumns()).to.equal(3);
            expect(area.data()).to.deep.equal([
                [7,4,8],
                [7,4,8],
                [9,2,7],
            ]);
        });

        it('should work with a positive anchor', () => {
            const area = gridl(mockData()).area([2,3,6,3,2,1]);
            expect(area.numRows()).to.equal(3);
            expect(area.numColumns()).to.equal(2);
            expect(area.data()).to.deep.equal([
                [7,4],
                [7,4],
                [9,2],
            ]);
        });

        it('should work with a negative anchor', () => {
            const area = gridl(mockData()).area([3,2,1,2,-2,-1]);
            expect(area.numRows()).to.equal(2);
            expect(area.numColumns()).to.equal(3);
            expect(area.data()).to.deep.equal([
                [6,7,4],
                [6,9,2],
            ]);
        });

    });

    describe('data (as setter)', () => {

        it('should set the data of the area', () => {
            const area = gridl(mockData()).area([2,3,1,2]).data([
                [1,1],
                [2,2],
                [3,3],
            ]);
            expect(area.data()).to.deep.equal([
                [1,1],
                [2,2],
                [3,3],
            ]);
        });

        it('should skip values that are outside the actual area', () => {
            const newData = [
                [1,1,1],
                [2,2,2],
                [3,3,3],
            ];
            const area = gridl(mockData()).area([2,2,1,1]).data(newData);
            expect(area.data()).to.deep.equal([
                [1,1],
                [2,2],
            ]);
        });

        it('should leave values untouched that are not set in the new data array', () => {
            const newData = [
                [1,1,1,1],
                [2],
                [3,3],
                [4,4,4],
            ];
            const area = gridl(mockData()).area([4,4,1,1]).data(newData);
            expect(area.data()).to.deep.equal([
                [1,1,1,1],
                [2,6,6,7],
                [3,3,6,7],
                [4,4,4,9],
            ]);
        });

        it('should return the area', () => {
            const newData = [
                [1,1],
                [2,2],
                [3,3],
            ];
            const area = gridl(mockData()).area([2,3,1,2]);
            expect(area.data(newData)).to.deep.equal(area);
        });

    });

    describe('apply', () => {

        it('should apply new values to the main grid', () => {
            const localPos = [2,1];
            const grid = gridl(mockData());
            const area = grid.area([3,2,1,2]);
            area.valueAt(localPos, 999);
            expect(grid.data()).to.deep.equal(mockData());
            area.apply();
            expect(grid.data()).to.deep.equal([
                [0,7,3,2,8,4,8],
                [4,2,5,7,8,4,8],
                [6,6,6,6,7,4,8],
                [6,6,6,999,7,4,8],
                [6,5,1,6,9,2,7],
            ]);
        });

        it('should ignore values that are set outside the area', () => {
            const localPos = [2,4];
            const grid = gridl(mockData());
            const area = grid.area([3,2,1,2]);
            area.valueAt(localPos, 999);
            area.apply();
            expect(grid.data()).to.deep.equal(mockData());
        });

        it('should return the gridl instance', () => {
            const grid = gridl(mockData());
            const result = grid.area([3,2]).apply();
            expect(result).to.deep.equal(grid);
        });

    });

    describe('parent', () => {

        it('should return the gridl instance', () => {
            const grid = gridl(mockData());
            const result = grid.area([3,2]).parent();
            expect(result).to.deep.equal(grid);
        });

    });

    describe('localToGlobal', () => {

        it('should convert the local position to a global position', () => {
            const area = gridl(mockData()).area([3,3,2,1]);
            expect(area.localToGlobal([1,2])).to.deep.equal([3,3]);
        });

        it('should not be affected by usage of an anchor', () => {
            const area = gridl(mockData()).area([3,3,2,1,1,2]);
            expect(area.localToGlobal([1,2])).to.deep.equal([3,3]);
        });

    });

    describe('globalToLocal', () => {

        it('should convert the local position to a global position', () => {
            const area = gridl(mockData()).area([3,3,2,1]);
            expect(area.globalToLocal([3,3])).to.deep.equal([1,2]);
        });

        it('should not be affected by usage of an anchor', () => {
            const area = gridl(mockData()).area([3,3,3,2,1,2]);
            expect(area.localToGlobal([1,2])).to.deep.equal([4,4]);
        });

    });

    describe('reduce', () => {

        it('should execute the callback on each cell within the area', () => {
            const result = gridl(mockData()).area([3,2,1,2]).reduce((acc, value) => acc.concat(value), []);
            expect(result).to.deep.equal([6,6,6,6,6,6]);
        });

        it('should reduce the area to sum of all values', () => {
            expect(gridl(mockData()).area([3,2,2,1]).reduce((res, value) => res + value, 0)).to.equal(39);
        });

        it('should provide the positions on the grid within the callback', () => {
            const result = gridl(mockData()).area([3,2,1,2]).reduce((acc, value, pos) => acc.concat([pos]), []);
            expect(result).to.deep.equal([
                [0,0],[1,0],[2,0],
                [0,1],[1,1],[2,1],
            ]);
        });

        it('should provide the area instance within the callback', () => {
            const area = gridl(mockData()).area([3,2,1,2]);
            const result = area.reduce((acc, value, pos, src) => {
                expect(src).to.deep.equal(area);
                return acc + 1;
            }, 0);
            expect(result).to.equal(6);
        });

        it('should use the initial value if provided', () => {
            expect(gridl(mockData()).area([3,2,1,2]).reduce(acc => acc, 666)).to.equal(666);
        });

        it('should throw an error if no callback is provided', () => {
            expect(() => gridl(mockData()).area([3,2,1,2]).reduce()).to.throw();
        });

    });

    describe('map', () => {

        it('should execute the callback on each cell within the area', () => {
            const area1 = gridl(mockData()).area([3,2,1,2]);
            const area2 = area1.map(() => '7');
            expect(area2.data()).to.deep.equal([
                ['7','7','7'],
                ['7','7','7'],
            ]);
        });

        it('should return a copy of the original area, should not change the original area', () => {
            const area1 = gridl(mockData()).area([3,2,1,2]);
            const area2 = area1.map(v => v);
            expect(area2).to.not.deep.equal(area1);
        });

        it('should replace all values', () => {
            const area = gridl(mockData()).area([3,2,1,2]);
            expect(area.data()).to.deep.equal([
                [6,6,6],
                [6,6,6],
            ]);
            let i = 0;
            expect(area.map(() => i++).data()).to.deep.equal([
                [0,1,2],
                [3,4,5],
            ]);
        });

        it('should provide the current value in the callback', () => {
            const expectedArea = [
                [0,7,3],
                [4,2,5],
                [6,6,6],
            ];
            gridl(mockData()).area([3,3]).map((v, pos) => {
                const [x,y] = pos;
                expect(v).to.equal(expectedArea[y][x]);
            });
        });

        it('should provide the local position in the callback', () => {
            const result = gridl(mockData())
                .area([3,3])
                .map((v, pos) => `${pos[0]},${pos[1]}`)
                .data();
            expect(result).to.deep.equal([
                ['0,0','1,0','2,0'],
                ['0,1','1,1','2,1'],
                ['0,2','1,2','2,2'],
            ]);
        });

        it('should provide the area in the callback', () => {
            let callCount = 0;
            const area = gridl(mockData()).area([3,3]);
            area.map((v, pos, src) => {
                callCount++;
                expect(src).to.deep.equal(area);
            });
            expect(callCount).to.equal(9); // just make sure callback was invoked
        });

        it('should provide the thisArg as "this" in the callback', () => {
            let callCount = 0;
            const thisMock = { saySomething: () => 'I like rusty spoons!' };
            const area = gridl(mockData()).area([3,3]);
            area.map(function() {
                callCount++;
                expect(this).to.deep.equal(thisMock);
                expect(this.saySomething()).to.equal('I like rusty spoons!');
            }, thisMock);
            expect(callCount).to.equal(9); // just make sure callback was invoked
        });

        it('should throw an error if no callback is provided', () => {
            expect(() => gridl(mockData()).area([3,3]).map()).to.throw();
        });

        it('should provide the origin gridl instance as parent', () => {
            const g = gridl(mockData());
            const area = g.area([3,3]).map(v => v);
            expect(area.parent()).to.deep.equal(g);
        });

        it('should apply it to the main grid when using calling apply() on the area', () => {
            const result = gridl(mockData())
                .area([3,3,1,1])
                .map(() => 0)
                .apply()
                .data();
            expect(result).to.deep.equal([
                [0,7,3,2,8,4,8],
                [4,0,0,0,8,4,8],
                [6,0,0,0,7,4,8],
                [6,0,0,0,7,4,8],
                [6,5,1,6,9,2,7],
            ]);
        });

    });

    describe('fill', () => {

        it('should fill all cells with the same value', () => {
            const res = gridl(mockData()).area([4,3]).fill('x').data();
            expect(res).to.deep.equal([
                ['x','x','x','x'],
                ['x','x','x','x'],
                ['x','x','x','x'],
            ]);
        });

        it('should fill all values with the same value, using a callback function', () => {
            const res = gridl(mockData()).area([4,3]).fill(() => 'x').data();
            expect(res).to.deep.equal([
                ['x','x','x','x'],
                ['x','x','x','x'],
                ['x','x','x','x'],
            ]);
        });

        it('should fill all values with different values', () => {
            const area = gridl(mockData()).area([4,3]);
            area.fill((value, pos) => {
                return pos[0] < 2 ? 'a' : 'b';
            });
            expect(area.data()).to.deep.equal([
                ['a','a','b','b'],
                ['a','a','b','b'],
                ['a','a','b','b'],
            ]);
        });

        it('should return the original area, no copy', () => {
            const area1 = gridl(mockData()).area([3,2,1,2]);
            const area2 = area1.fill('s');
            expect(area2).to.deep.equal(area1);
        });

        it('should provide the current value in the callback', () => {
            const expectedArea = [
                [0,7,3],
                [4,2,5],
                [6,6,6],
            ];
            gridl(mockData()).area([3,3]).fill((v, pos) => {
                const [x,y] = pos;
                expect(v).to.equal(expectedArea[y][x]);
            });
        });

        it('should provide the local position in the callback', () => {
            const result = gridl(mockData())
                .area([3,3])
                .fill((v, pos) => `${pos[0]},${pos[1]}`)
                .data();
            expect(result).to.deep.equal([
                ['0,0','1,0','2,0'],
                ['0,1','1,1','2,1'],
                ['0,2','1,2','2,2'],
            ]);
        });

        it('should provide the area in the callback', () => {
            let callCount = 0;
            const area = gridl(mockData()).area([4,3]);
            area.fill((v, pos, src) => {
                expect(src).to.deep.equal(area);
                callCount++;
            });
            expect(callCount).to.equal(12);
        });

        it('should fill all cells with undefined if no value is provided', () => {
            const res = gridl(mockData()).area([4,3]).fill().data();
            expect(res).to.deep.equal([
                [undefined,undefined,undefined,undefined],
                [undefined,undefined,undefined,undefined],
                [undefined,undefined,undefined,undefined],
            ]);
        });

        it('should return the area instance', () => {
            const area = gridl(mockData()).area([4,3]);
            const res = area.fill(v => v);
            expect(res).to.deep.equal(area);
        });

        it('should return the original gridl instance as parent', () => {
            const g = gridl(mockData());
            const parent = g.area([4,3]).fill(v => v).parent();
            expect(parent).to.deep.equal(g);
        });

        it('should apply it to the main grid when using calling apply() on the area', () => {
            const result = gridl(mockData())
                .area([3,3,1,1])
                .fill(0)
                .apply()
                .data();
            expect(result).to.deep.equal([
                [0,7,3,2,8,4,8],
                [4,0,0,0,8,4,8],
                [6,0,0,0,7,4,8],
                [6,0,0,0,7,4,8],
                [6,5,1,6,9,2,7],
            ]);
        });

        it('should provide the thisArg as "this" in the callback', () => {
            let callCount = 0;
            const thisMock = { saySomething: () => 'I like rusty spoons!' };
            const area = gridl(mockData()).area([3,3]);
            area.fill(function() {
                callCount++;
                expect(this).to.deep.equal(thisMock);
                expect(this.saySomething()).to.equal('I like rusty spoons!');
                return 'x';
            }, thisMock);
            expect(callCount).to.equal(9);
        });

    });

    describe('find', () => {

        it('should return the position of the first occurrence by value', () => {
            const result = gridl(mockData()).area([4,3,1,1]).find(7);
            expect(result).to.deep.equal([2,0]);
        });

        it('should return the position of the first occurrence by compare function', () => {
            const result = gridl(mockData()).area([4,3,1,1]).find(v => v === 7);
            expect(result).to.deep.equal([2,0]);
        });

        it('should return undefined if the are no findings', () => {
            const result = gridl(mockData()).area([3,2,1,1]).find(v => v === 9);
            expect(result).to.equal(undefined);
        });

        it('should provide the current value in the callback', () => {
            const expectedArea = [
                [0,7,3],
                [4,2,5],
                [6,6,6],
            ];
            let callCount = 0;
            gridl(mockData()).area([3,3]).find((v, pos) => {
                const [x,y] = pos;
                expect(v).to.equal(expectedArea[y][x]);
                callCount++;
                return false;
            });
            expect(callCount).to.equal(9);
        });

        it('should provide the local position in the callback', () => {
            const expectedPositions = [
                [0,0], [1,0], [2,0],
                [0,1], [1,1], [2,1],
                [0,2], [1,2], [2,2],
            ];
            let callCount = 0;
            gridl(mockData())
                .area([3,3])
                .find((v, pos) => {
                    expect(pos).to.deep.equal(expectedPositions[callCount]);
                    callCount++;
                    return false;
                });
            expect(callCount).to.equal(9);
        });

        it('should provide the area in the callback', () => {
            let callCount = 0;
            const area = gridl(mockData()).area([4,3]);
            area.find((v, pos, src) => {
                expect(src).to.deep.equal(area);
                callCount++;
            });
            expect(callCount).to.equal(12);
        });

        it('should provide the thisArg as "this" in the callback', () => {
            let callCount = 0;
            const thisMock = { saySomething: () => 'I like rusty spoons!' };
            const area = gridl(mockData()).area([3,3]);
            area.find(function() {
                callCount++;
                expect(this).to.deep.equal(thisMock);
                expect(this.saySomething()).to.equal('I like rusty spoons!');
            }, thisMock);
            expect(callCount).to.equal(9);
        });

    });

    describe('forEach', () => {

        it('should execute the callback on each cell within the area', () => {
            let callCount = 0;
            const expectedCells = [7,4,8,9,2,7];
            gridl(mockData()).area([3,2,4,3]).forEach(value => {
                expect(value).to.equal(expectedCells[callCount]);
                callCount++;
            });
            expect(callCount).to.equal(6);
        });

        it('should return the original area', () => {
            const area1 = gridl(mockData()).area([3,2,1,2]);
            const area2 = area1.forEach(function() {});
            expect(area2).to.deep.equal(area1);
        });

        it('should provide the local position in the callback', () => {
            const expectedPositions = [
                [0,7,3],
                [4,2,5],
                [6,6,6],
            ];
            let callCount = 0;
            gridl(mockData()).area([3,3]).forEach((v, pos) => {
                const [x,y] = pos;
                expect(v).to.deep.equal(expectedPositions[y][x]);
                callCount++;
            });
            expect(callCount).to.deep.equal(9);
        });

        it('should provide the area in the callback', () => {
            let callCount = 0;
            const area = gridl(mockData()).area([3,3]);
            area.forEach((v, pos, src) => {
                callCount++;
                expect(src).to.deep.equal(area);
            });
            expect(callCount).to.equal(9);
        });

        it('should provide the thisArg as "this" in the callback', () => {
            let callCount = 0;
            const thisMock = { saySomething: () => 'I like rusty spoons!' };
            const area = gridl(mockData()).area([3,3]);
            area.forEach(function() {
                callCount++;
                expect(this).to.deep.equal(thisMock);
                expect(this.saySomething()).to.equal('I like rusty spoons!');
            }, thisMock);
            expect(callCount).to.equal(9); // just make sure callback was invoked
        });

        it('should throw an error if no callback is provided', () => {
            expect(() => gridl(mockData()).area([3,3]).forEach()).to.throw();
        });

    });

    describe('isInside', () => {

        it('should fit into a equally sized area', () => {
            const result = gridl(mockData()).area([2,3,3,2]).isInside([2,3,3,2]);
            expect(result).to.equal(true);
        });

        it('should fit into a bigger area', () => {
            const result = gridl(mockData()).area([2,3,3,2]).isInside([4,4,3,2]);
            expect(result).to.equal(true);
        });

        it('should not fit at the right', () => {
            const result = gridl(mockData()).area([2,3,1,1]).isInside([2,3,0,1]);
            expect(result).to.equal(false);
        });

        it('should not fit at the bottom', () => {
            const result = gridl(mockData()).area([2,3,1,1]).isInside([2,3,1,0]);
            expect(result).to.equal(false);
        });

        it('should not fit at the right and the bottom', () => {
            const result = gridl(mockData()).area([2,3,1,1]).isInside([2,3,0,0]);
            expect(result).to.equal(false);
        });

        it('should fit with an anchor', () => {
            const result = gridl(mockData()).area([2,3,3,2,1,1]).isInside([4,4,3,2,2,2]);
            expect(result).to.equal(true);
        });

        it('should not fit with an anchor at the top', () => {
            const result = gridl(mockData()).area([2,3,3,2,1,1]).isInside([2,3,3,2,0,-1]);
            expect(result).to.equal(false);
        });

        it('should not fit with an anchor at the left', () => {
            const result = gridl(mockData()).area([2,3,3,2,1,1]).isInside([2,3,3,2,-1,0]);
            expect(result).to.equal(false);
        });

        it('should not fit with an anchor at the right', () => {
            const result = gridl(mockData()).area([2,3,3,2,1,1]).isInside([2,3,3,2,1,0]);
            expect(result).to.equal(false);
        });

        it('should not fit with an anchor at the bottom', () => {
            const result = gridl(mockData()).area([2,3,3,2,1,1]).isInside([2,3,3,2,0,1]);
            expect(result).to.equal(false);
        });

    });

    describe('contains', () => {

        it('should contain an equally sized area', () => {
            const result = gridl(mockData()).area([2,3,3,2]).contains([2,3,3,2]);
            expect(result).to.equal(true);
        });

        it('should contain a smaller area', () => {
            const result = gridl(mockData()).area([4,4,3,2]).contains([2,3,3,2]);
            expect(result).to.equal(true);
        });

        it('should not contain at the right', () => {
            const result = gridl(mockData()).area([2,3,0,1]).contains([2,3,1,1]);
            expect(result).to.equal(false);
        });

        it('should not contain at the bottom', () => {
            const result = gridl(mockData()).area([2,3,1,0]).contains([2,3,1,1]);
            expect(result).to.equal(false);
        });

        it('should not contain at the right and the bottom', () => {
            const result = gridl(mockData()).area([2,3,0,0]).contains([2,3,1,1]);
            expect(result).to.equal(false);
        });

        it('should contain with an anchor', () => {
            const result = gridl(mockData()).area([4,4,3,2,2,2]).contains([2,3,3,2,1,1]);
            expect(result).to.equal(true);
        });

        it('should not contain with an anchor at the top', () => {
            const result = gridl(mockData()).area([2,3,3,2,0,-1]).contains([2,3,3,2,1,1]);
            expect(result).to.equal(false);
        });

        it('should not contain with an anchor at the left', () => {
            const result = gridl(mockData()).area([2,3,3,2,-1,0]).contains([2,3,3,2,1,1]);
            expect(result).to.equal(false);
        });

        it('should not contain with an anchor at the right', () => {
            const result = gridl(mockData()).area([2,3,3,2,1,0]).contains([2,3,3,2,1,1]);
            expect(result).to.equal(false);
        });

        it('should not contain with an anchor at the bottom', () => {
            const result = gridl(mockData()).area([2,3,3,2,0,1]).contains([2,3,3,2,1,1]);
            expect(result).to.equal(false);
        });

    });

    describe('intersectsWith', () => {

        it('should return true for two equal areas intersection', () => {
            const area = [4,2,1,3];
            const result = gridl(mockData()).area(area).intersectsWith(area);
            expect(result).to.equal(true);
        });

        it('should return true for partly intersecting areas', () => {
            const area1 = [3,2,1,1];
            const area2 = [4,3,2,2];
            const result = gridl(mockData()).area(area1).intersectsWith(area2);
            expect(result).to.equal(true);
        });

        it('should return true when one area is inside the other area', () => {
            const area1 = [5,4,0,0];
            const area2 = [3,2,1,1];
            const result = gridl(mockData()).area(area1).intersectsWith(area2);
            expect(result).to.equal(true);
        });

        it('should return false when area1 is above area2', () => {
            const area1 = [3,2,1,1];
            const area2 = [4,3,2,3];
            const result = gridl(mockData()).area(area1).intersectsWith(area2);
            expect(result).to.equal(false);
        });

        it('should return false when area1 is below area2', () => {
            const area1 = [4,3,2,3];
            const area2 = [3,2,1,1];
            const result = gridl(mockData()).area(area1).intersectsWith(area2);
            expect(result).to.equal(false);
        });

        it('should return false when area1 is left to area2', () => {
            const area1 = [2,2,0,0];
            const area2 = [3,2,2,0];
            const result = gridl(mockData()).area(area1).intersectsWith(area2);
            expect(result).to.equal(false);
        });

        it('should return false when area1 is right to area2', () => {
            const area1 = [3,2,2,1];
            const area2 = [2,2,0,0];
            const result = gridl(mockData()).area(area1).intersectsWith(area2);
            expect(result).to.equal(false);
        });

        it('should return false when area1 is far away from area2', () => {
            const area1 = [3,2,0,0];
            const area2 = [2,2,4,4];
            const result = gridl(mockData()).area(area1).intersectsWith(area2);
            expect(result).to.equal(false);
        });

    });

    describe('intersection', () => {

        it('should return the overlapping area', () => {
            const area1 = [3,3,2,1];
            const area2 = [5,3,3,2];
            const intersection1 = gridl(mockData()).area(area1).intersection(area2).data();
            const intersection2 = gridl(mockData()).area(area2).intersection(area1).data();
            const expected = [
                [6,7],
                [6,7],
            ];
            expect(intersection1).to.deep.equal(expected);
            expect(intersection2).to.deep.equal(expected);
        });

        it('should return the overlapping area by using anchor points', () => {
            const area1 = [4,4,2,1,1,1];
            const area2 = [7,4,4,2,2,1];
            const intersection1 = gridl(mockData()).area(area1).intersection(area2).data();
            const intersection2 = gridl(mockData()).area(area2).intersection(area1).data();
            const expected = [
                [5,7,8],
                [6,6,7],
                [6,6,7],
            ];
            expect(intersection1).to.deep.equal(expected);
            expect(intersection2).to.deep.equal(expected);
        });

        it('should return false if there is no intersection', () => {
            const area1 = [2,2,0,1];
            const area2 = [3,2,4,3];
            const intersection1 = gridl(mockData()).area(area1).intersection(area2);
            const intersection2 = gridl(mockData()).area(area2).intersection(area1);
            expect(intersection1).to.equal(false);
            expect(intersection2).to.equal(false);
        });

        it('should return false if there is a vertical but no horizontal intersection', () => {
            const area1 = [2,2,0,1];
            const area2 = [3,2,1,4];
            const intersection1 = gridl(mockData()).area(area1).intersection(area2);
            const intersection2 = gridl(mockData()).area(area2).intersection(area1);
            expect(intersection1).to.equal(false);
            expect(intersection2).to.equal(false);
        });

        it('should return false if there is a horizontal but no vertical intersection', () => {
            const area1 = [2,2,0,1];
            const area2 = [3,2,3,2];
            const intersection1 = gridl(mockData()).area(area1).intersection(area2);
            const intersection2 = gridl(mockData()).area(area2).intersection(area1);
            expect(intersection1).to.equal(false);
            expect(intersection2).to.equal(false);
        });

    });

    describe('column', () => {

        it('should be a function', () => {
            const area = gridl(mockData()).area([3,3,2,2]);
            expect(typeof area.column).to.equal('function');
        });

        it('should return a certain column within the area', () => {
            const area = gridl(mockData()).area([3,4,2,1]);
            expect(area.column(0)).to.deep.equal([5,6,6,1]);
            expect(area.column(1)).to.deep.equal([7,6,6,6]);
            expect(area.column(2)).to.deep.equal([8,7,7,9]);
        });

        it('should cut off rows outside the area (bottom)', () => {
            const area = gridl(mockData()).area([3,4,2,3]);
            expect(area.column(0)).to.deep.equal([6,1]);
            expect(area.column(1)).to.deep.equal([6,6]);
            expect(area.column(2)).to.deep.equal([7,9]);
        });

        it('should cut off rows outside the area (top using an anchor)', () => {
            const area = gridl(mockData()).area([3,4,2,1,0,2]);
            expect(area.column(0)).to.deep.equal([3,5,6]);
            expect(area.column(1)).to.deep.equal([2,7,6]);
            expect(area.column(2)).to.deep.equal([8,8,7]);
        });

        it('should return undefined for columns outside the area', () => {
            const area = gridl(mockData()).area([3,4,2,2]);
            expect(area.column(-1)).to.equal(undefined);
            expect(area.column(-2)).to.equal(undefined);
            expect(area.column(-999)).to.equal(undefined);
            expect(area.column(3)).to.equal(undefined);
            expect(area.column(4)).to.equal(undefined);
            expect(area.column(9999)).to.equal(undefined);
        });

    });

    describe('row', () => {

        it('should be a function', () => {
            const area = gridl(mockData()).area([3,3,2,2]);
            expect(typeof area.row).to.equal('function');
        });

        it('should return a certain row within the area', () => {
            const area = gridl(mockData()).area([3,4,2,1]);
            expect(area.row(0)).to.deep.equal([5,7,8]);
            expect(area.row(1)).to.deep.equal([6,6,7]);
            expect(area.row(2)).to.deep.equal([6,6,7]);
            expect(area.row(3)).to.deep.equal([1,6,9]);
        });

        it('should cut off columns outside the area (right)', () => {
            const area = gridl(mockData()).area([4,3,5,2]);
            expect(area.row(0)).to.deep.equal([4,8]);
            expect(area.row(1)).to.deep.equal([4,8]);
            expect(area.row(2)).to.deep.equal([2,7]);
        });

        it('should cut off columns outside the area (left using an anchor)', () => {
            const area = gridl(mockData()).area([4,3,1,1,2,0]);
            expect(area.row(0)).to.deep.equal([4,2,5]);
            expect(area.row(1)).to.deep.equal([6,6,6]);
            expect(area.row(2)).to.deep.equal([6,6,6]);
        });

        it('should return undefined for rows outside the area', () => {
            const area = gridl(mockData()).area([4,3,2,2]);
            expect(area.row(-1)).to.equal(undefined);
            expect(area.row(-2)).to.equal(undefined);
            expect(area.row(-999)).to.equal(undefined);
            expect(area.row(3)).to.equal(undefined);
            expect(area.row(4)).to.equal(undefined);
            expect(area.row(9999)).to.equal(undefined);
        });

    });

});
