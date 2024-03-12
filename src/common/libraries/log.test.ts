describe('log library', () => {
   test('debug logged in non-prod', async () => {
      // @ts-expect-error
      const { log } = await import('./log.ts');
      const spy = jest.spyOn(console, 'debug').mockImplementation(() => {});
      log.debug('foo');
      expect(spy).toHaveBeenCalledWith('foo');
   })

   test('error logged in non-prod', async () => {
      // @ts-expect-error
      const { log } = await import('./log.ts');
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      log.error('foo');
      expect(spy).toHaveBeenCalledWith('foo');
   })

   test('info logged in non-prod', async () => {
      // @ts-expect-error
      const { log } = await import('./log.ts');
      const spy = jest.spyOn(console, 'info').mockImplementation(() => {});
      log.info('foo');
      expect(spy).toHaveBeenCalledWith('foo');
   })

   test('log logged in non-prod', async () => {
      // @ts-expect-error
      const { log } = await import('./log.ts');
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
      log.log('foo');
      expect(spy).toHaveBeenCalledWith('foo');
   })

   test('warn logged in non-prod', async () => {
      // @ts-expect-error
      const { log } = await import('./log.ts');
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      log.warn('foo');
      expect(spy).toHaveBeenCalledWith('foo');
   })

   test('debug not logged in prod', async () => {
      // resetting REACT_APP_ENV
      process.env.REACT_APP_ENV = 'PROD';
      jest.resetModules();
      // @ts-expect-error
      const { log } = await import('./log.ts');
      const spy = jest.spyOn(console, 'debug').mockImplementation(() => {});
      log.debug('foo');
      expect(spy).not.toHaveBeenCalledWith('foo');
   })

   test('error not logged in prod', async () => {
      // @ts-expect-error
      const { log } = await import('./log.ts');
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      log.error('foo');
      expect(spy).not.toHaveBeenCalledWith('foo');
   })

   test('info not logged in prod', async () => {
      // @ts-expect-error
      const { log } = await import('./log.ts');
      const spy = jest.spyOn(console, 'info').mockImplementation(() => {});
      log.info('foo');
      expect(spy).not.toHaveBeenCalledWith('foo');
   })

   test('log not logged in prod', async () => {
      // @ts-expect-error
      const { log } = await import('./log.ts');
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
      log.log('foo');
      expect(spy).not.toHaveBeenCalledWith('foo');
   })

   test('warn not logged in prod', async () => {
      // @ts-expect-error
      const { log } = await import('./log.ts');
      const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      log.warn('foo');
      expect(spy).not.toHaveBeenCalledWith('foo');
   })
})