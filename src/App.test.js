import React from 'react';
import { mount } from 'enzyme';
import App from '@/App';
import { testCategories, testItems } from '@/helpers/testData';
import api from '@/api/api';
import { makeID, parseToYearsAndMonth, padLeft } from '@/helpers/utility';
import { Router, MemoryRouter, BrowserRouter } from 'react-router-dom';
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  screen,
} from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';
import fakeData from '@/__mocks__/db.json';
import useFacebookLogin from './hooks/useFacebookLogin';
jest.mock('./hooks/useFacebookLogin');

describe('test App component init behavior', () => {
  let wrapper;
  const waitForAsync = () => act(() => Promise.resolve());

  beforeAll(() => {
    useFacebookLogin.mockReturnValue([
      {
        status: 'connected',
      },
      jest.fn(),
      jest.fn(),
    ]);

    jest.spyOn(api, 'get').mockImplementation((url) => {
      if (url.indexOf('category') > -1) {
        return Promise.resolve({
          data: testCategories,
        });
      }
      if (url.indexOf('ledger?') > -1) {
        return Promise.resolve({
          data: testItems,
        });
      }
      if (url.indexOf('ledger/') > -1) {
        return Promise.resolve({
          data: {
            ...testItems[2],
          },
        });
      }
    });
    jest.spyOn(api, 'post').mockImplementation((url) => {
      return Promise.resolve({ data: { ...testItems[0] } });
    });
    jest.spyOn(api, 'patch').mockImplementation((url, updateObj) => {
      //尋找testItems陣列原本id的item
      const modifiedItem = testItems.find((item) => item.id === updateObj.id);
      return Promise.resolve({ data: { ...modifiedItem, ...updateObj } }); //返回覆蓋過後的
    });
    jest.spyOn(api, 'delete').mockImplementation((url) => {
      // const id = url.match(/\w+/g)[1]
      // const filteredItem = testItems.find((item) => item.id === id)
      // return Promise.resolve({ data: filteredItem })
      return Promise.resolve(); //這邊不需要用到回傳資料
    });
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });
  afterAll(() => {
    jest.restoreAllMocks(); // 需要恢復spyOn
    // console.log('原本的api get', api.get('/ledger'));//會記憶體洩漏 A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find le
  });
  //app home加載過後 => app的state資料長度等於test資料長度
  it('check App Home state with initial action', async () => {
    const history = createMemoryHistory();
    const { debug } = render(
      <Router history={history}>
        <App />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getAllByTitle('editBtn').length).toBe(testItems.length); //
    });
    expect(api.get).toHaveBeenCalledTimes(2);
    // --------------------------------------------------
    //enzyme版本 ok
    // wrapper = mount(
    //   <MemoryRouter>
    //     <App />
    //   </MemoryRouter>
    // );

    // setTimeout(() => {
    //   wrapper.update();
    //   console.log(wrapper.debug());
    //   expect(wrapper.find('.ledger-item').length).toBe(testItems.length);
    //   expect(api.get).toHaveBeenCalledTimes(2);
    //   done();
    // }, 0);
  });

  it('check App Home change ViewTab and LedgerList should show right', async () => {
    const history = createMemoryHistory();
    const { debug } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    await waitForAsync();
    fireEvent.click(screen.getByText(/圖表/));
    await waitFor(() => {
      expect(screen.queryByTestId('ledgerList')).toBeNull();
    });
    fireEvent.click(screen.getByText(/列表/));
    await waitFor(() => {
      expect(screen.queryByTestId('ledgerList')).toBeInTheDocument();
    });

    //enzyme版本 ok
    // const history = createMemoryHistory();
    // const wrapper = mount(
    //   <Router history={history}>
    //     <App />
    //   </Router>
    // );
    // setTimeout(() => {
    //   wrapper.update();
    //   console.log(wrapper.debug());
    //   wrapper.find('[data-testid="tab-1"]').simulate('click');
    //   expect(wrapper.find(LedgerList).length).toEqual(0);
    //   wrapper.find('[data-testid="tab-0"]').simulate('click');
    //   expect(wrapper.find(LedgerList).length).toBe(1);
    //   done();
    // }, 100);
  });
  // ----

  //首頁加載過資料後 到創建頁呼叫getEditData => 不會再發新api.get，只有mount的兩次
  it('test getEditData with initial data in create mode', async () => {
    const history = createMemoryHistory();
    const { getByTestId, debug } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    await waitForAsync();
    fireEvent.click(getByTestId('createBtn'));
    await waitForAsync();
    expect(history.location.pathname).toBe('/create');
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  //沒有加載過資料，直接到達創建頁新建
  it('test getEditData without initial data in create mode', async () => {
    const history = createMemoryHistory();
    history.push('/create');
    const { getByTestId, debug } = render(
      // <Router history={history} initialEntries={['/create']}> // 無效
      <Router history={history}>
        <App />
      </Router>
    );
    //方式二成功
    // const renderWithRouter = (ui, { route = '/' } = {}) => {
    //   window.history.pushState({}, 'Test page', route);
    //   return render(ui, { wrapper: BrowserRouter });
    //   // return render(ui, { wrapper: MemoryRouter });
    // };
    // const { container, debug, getByTestId } = renderWithRouter(<App />, {
    //   route: '/create',
    // });
    await waitForAsync();
    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith('/category');
  });

  //首頁加載後，創建頁做編輯 ，api一樣只get兩次(items、categories) edit mode不會再發請求
  it('test getEditData with initial data in edit mode', async () => {
    const history = createMemoryHistory();
    const { getByTestId, debug } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    await waitForAsync();
    fireEvent.click(
      getByTestId('ledger-item-_1fg1wme63').querySelector('.btn-edit')
    );
    // fireEvent.click(getByTestId('editBtn-_1fg1wme63'));//也可
    await waitForAsync();
    expect(getByTestId('submit')).toBeInTheDocument();
    expect(api.get).toHaveBeenCalledTimes(2);
    expect(history.location.pathname).toBe('/edit/_1fg1wme63');
  });

  //直接到達編輯頁
  it('test getEditData without initial data in edit mode', async () => {
    // expect.assertions(3);//非同步需要
    const renderWithRouter = (ui, { route = '/' } = {}) => {
      window.history.pushState({}, 'Test page', route);
      return render(ui, { wrapper: BrowserRouter });
      // return render(ui, { wrapper: MemoryRouter });
    };
    const { container, debug, getByTestId, rerender } = renderWithRouter(
      <App />,
      {
        route: '/edit/_1fg1wme63',
      }
    );
    await waitForAsync();
    expect(api.get).toHaveBeenCalledTimes(2);
    expect(api.get).toHaveBeenNthCalledWith(1, '/category');
    expect(api.get).toHaveBeenNthCalledWith(2, '/ledger/_1fg1wme63');
  });
});

// describe('test App component with json-server api', () => {
describe('test App component with msw', () => {
  const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 100));
  const promise = Promise.resolve();
  const apiUrl = process.env.REACT_APP_URL;
  const currentDateObj = parseToYearsAndMonth();
  const fakePostData = {
    id: makeID(),
    title: 'new title',
    amount: 300,
    date: `${currentDateObj.year}-${padLeft(currentDateObj.month)}-10`,
    cid: 1,
    timestamp: new Date().getTime(),
    monthCategory: `${currentDateObj.year}-${currentDateObj.month}`,
  };
  const server = setupServer(
    rest.get(`${apiUrl}/category`, (req, res, ctx) =>
      res(ctx.json(fakeData?.category))
    ),
    rest.get(`${apiUrl}/ledger`, (req, res, ctx) => {
      const { monthCategory = '' } = Object.fromEntries(req.url.searchParams);
      const result = fakeData?.ledger?.filter((item) => {
        return item.monthCategory.includes(monthCategory);
      });
      return res(ctx.json(result));
    }),
    rest.get(`${apiUrl}/ledger/:id`, (req, res, ctx) =>
      res(ctx.json(fakeData?.ledger))
    ),
    rest.post(`${apiUrl}/ledger`, (req, res, ctx) =>
      res(ctx.json(fakePostData))
    ),
    rest.patch(`${apiUrl}/ledger/:id`, (req, res, ctx) =>
      res(ctx.json(fakeData?.ledger))
    ),
    rest.delete(`${apiUrl}/ledger/:id`, (req, res, ctx) =>
      res(ctx.json(fakeData?.ledger))
    )
  );

  beforeAll(() => {
    server.listen();
    useFacebookLogin.mockReturnValue([
      {
        status: 'connected',
      },
      jest.fn(),
      jest.fn(),
    ]);
  });

  afterEach(() => {
    server.resetHandlers();
    jest.clearAllMocks();
  });

  afterAll(() => server.close());

  it('click the year&month item, should show the right ledgerItem', async () => {
    jest.spyOn(api, 'get');
    const history = createMemoryHistory();
    const { debug, getByTestId, getByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    await waitForAsync();
    act(() => {
      fireEvent.click(getByTestId('MonthPicker-button'));
    });
    act(() => {
      fireEvent.click(getByTestId('MonthPicker-year-2021'));
    });
    act(() => {
      fireEvent.click(getByTestId('MonthPicker-month-02'));
    });
    await waitForAsync();
    await waitFor(() =>
      expect(screen.getAllByTitle('ledger-item').length).toBe(4)
    );
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(3));
  });

  //觸發app create =>post被觸發一次，之後items增加一個
  it('test createItem with initial data', async () => {
    jest.spyOn(api, 'post');
    const history = createMemoryHistory();
    history.push('/');
    const { debug, getByTestId } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    await waitForAsync();
    fireEvent.click(getByTestId('createBtn'));
    await waitForAsync();
    fireEvent.click(screen.getByText(/旅行/));
    fireEvent.change(screen.getByTestId('inputTitle'), {
      target: { value: fakePostData.title },
    });
    fireEvent.change(screen.getByTestId('inputAmount'), {
      target: { value: fakePostData.amount },
    });
    fireEvent.change(screen.getByTestId('inputDate'), {
      target: { value: fakePostData.date },
    });
    server.use(
      rest.get(`${apiUrl}/ledger`, (req, res, ctx) => {
        return res(ctx.json([fakePostData]));
      })
    );
    fireEvent.click(screen.getByTestId('submit'));
    await waitForAsync();
    expect(screen.getByText('new title')).toBeInTheDocument();
    expect(api.post).toHaveBeenCalledTimes(1);
  });

  //加載後 更新item
  // 觸發app create => patch被觸發一次，新顯示的item是對的
  it('test updateItem with initial data', async () => {
    server.use(
      rest.get(`${apiUrl}/ledger`, (req, res, ctx) => {
        return res(ctx.json([fakePostData]));
      })
    );
    jest.spyOn(api, 'patch');
    const history = createMemoryHistory();
    history.push('/');
    const { debug, getByTestId, getByText } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    await waitForAsync();
    fireEvent.click(
      getByTestId(`ledger-item-${fakePostData.id}`).querySelector('.btn-edit')
    );
    await waitForAsync();
    fireEvent.change(screen.getByTestId('inputTitle'), {
      target: { value: '去彰化玩' },
    });
    server.use(
      rest.get(`${apiUrl}/ledger`, (req, res, ctx) => {
        const updatedItem = { ...fakePostData, title: '去彰化玩' };
        return res(ctx.json([updatedItem]));
      })
    );
    fireEvent.click(screen.getByTestId('submit'));
    await waitForAsync();
    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(screen.queryByText('去彰化玩')).toBeInTheDocument();
    });
    await act(() => promise);
  });

  //加載後 刪除item
  //觸發app的delete => api delete會呼叫一次，顯示的長度會比test資料少一個
  it('test deleteItem with initial data', async () => {
    server.use(
      rest.get(`${apiUrl}/ledger`, (req, res, ctx) => {
        return res(ctx.json([fakePostData]));
      })
    );
    jest.spyOn(api, 'delete');
    const history = createMemoryHistory();
    history.push('/');
    const { debug } = render(
      <Router history={history}>
        <App />
      </Router>
    );
    await waitForAsync(); // 等待首頁加載
    fireEvent.click(
      screen
        .getByTestId(`ledger-item-${fakePostData.id}`)
        .querySelector('.btn-delete')
    );
    server.use(
      rest.get(`${apiUrl}/ledger`, (req, res, ctx) => {
        const noData = {};
        return res(ctx.json([noData]));
      })
    );
    await waitForAsync(); // api更新
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledTimes(1);
      expect(screen.queryByTestId(`ledger-item-${fakePostData.id}`)).toBeNull();
    });
  });
});
