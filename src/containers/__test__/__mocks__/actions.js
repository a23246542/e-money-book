import { testCategories, testItems } from '../../../testData';
import { flattenArr } from '../../../utility';

export const actions = {
  getEditData: jest.fn().mockResolvedValue({
    editItem: testItems[1],
    categories: flattenArr(testCategories),
  }),
};
