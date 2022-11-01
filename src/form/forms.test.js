import React from "react";
import { render, screen} from '@testing-library/react';
import Form from './forms';

describe('When the form is monted ',() => {
    test('there must be a create product form page', () => {
        render(<Form />);
    })
})