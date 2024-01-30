import {Model} from "../model/Model.ts";

describe('Building model', () => {
    let model: Model;

    beforeEach(() => {
        model = new Model();
    });

    it('should be defined', () => {
        expect(model).toBeDefined();
    });
});