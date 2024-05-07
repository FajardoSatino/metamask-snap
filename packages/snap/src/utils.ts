export function assertInput(path: any) {
  console.log(`assertInputPath: => ${path}`);
  if (!path) {
    throw {
      code: -32000,
      message: 'Invalid input.',
    };
  }
}

export function assertAllStrings(input: any) {
  if (
    !Array.isArray(input) ||
    !input.every((item) => typeof item === 'string')
  ) {
    throw {
      code: -32000,
      message: 'Invalid input.',
    };
  }
}

export function assertIsArray(input: any) {
  if (!Array.isArray(input)) {
    throw {
      code: -32000,
      message: 'Invalid input.',
    };
  }
}

export function assertIsString(input: any) {
  console.log(`assertIsString: => ${typeof input}`);

  if (typeof input !== 'string') {
    throw {
      code: -32000,
      message: 'Invalid input.',
    };
  }
}

export function assertIsBoolean(input: any) {
  if (typeof input !== 'boolean') {
    throw {
      code: -32000,
      message: 'Invalid input.',
    };
  }
}

export function assertConfirmation(confirmed: any) {
  if (!confirmed) {
    throw {
      code: 4001,
      message: 'User rejected the request.',
    };
  }
}
