
  describe('Error Handling and Robustness', () => {
    it('handles empty string values gracefully', () => {
      const emptyStringData = [
        {
          invoice: '',
          date: new Date('2023-06-15'),
          firstName: '',
          lastName: '',
          course: '',
          price: 1000,
        },
      ];

      render(<IncomeTable coursesIncome={emptyStringData} />);
      
      // Should render empty cells but not crash
      expect(screen.getByText('1000 DA')).toBeInTheDocument();
      expect(screen.getByText('Thu Jun 15 2023')).toBeInTheDocument();
    });

    it('handles decimal price values', () => {
      const decimalPriceData = [
        {
          invoice: 'INV-DECIMAL',
          date: new Date('2023-06-15'),
          firstName: 'test',
          lastName: 'user',
          course: 'testing',
          price: 1234.56,
        },
      ];

      render(<IncomeTable coursesIncome={decimalPriceData} />);
      
      expect(screen.getByText('1234.56 DA')).toBeInTheDocument();
    });

    it('handles extreme date values', () => {
      const extremeDateData = [
        {
          invoice: 'INV-EXTREME',
          date: new Date('1900-01-01'),
          firstName: 'old',
          lastName: 'record',
          course: 'history',
          price: 100,
        },
      ];

      render(<IncomeTable coursesIncome={extremeDateData} />);
      
      expect(screen.getByText('Mon Jan 01 1900')).toBeInTheDocument();
    });

    it('handles Unicode characters in names and courses', () => {
      const unicodeData = [
        {
          invoice: 'INV-UNICODE',
          date: new Date('2023-06-15'),
          firstName: 'josé',
          lastName: 'garcía',
          course: 'español',
          price: 2000,
        },
      ];

      render(<IncomeTable coursesIncome={unicodeData} />);
      
      expect(screen.getByText('J García')).toBeInTheDocument();
      expect(screen.getByText('Español')).toBeInTheDocument();
    });

    it('handles numeric strings in name fields', () => {
      const numericNameData = [
        {
          invoice: 'INV-NUMERIC',
          date: new Date('2023-06-15'),
          firstName: '123',
          lastName: '456',
          course: '789',
          price: 3000,
        },
      ];

      render(<IncomeTable coursesIncome={numericNameData} />);
      
      expect(screen.getByText('1 456')).toBeInTheDocument();
      expect(screen.getByText('789')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('maintains table structure integrity with mixed data types', () => {
      const mixedData = [
        {
          invoice: 'INV-MIX-1',
          date: new Date('2023-01-15'),
          firstName: 'a',
          lastName: 'short',
          course: 'math',
          price: 0,
        },
        {
          invoice: 'INV-MIX-2-VERY-LONG-INVOICE-NUMBER',
          date: new Date('2023-12-31'),
          firstName: 'verylongfirstname',
          lastName: 'verylonglastname',
          course: 'very long course name with spaces',
          price: 999999.99,
        },
        {
          invoice: '',
          date: new Date('2023-06-15'),
          firstName: '',
          lastName: '',
          course: '',
          price: -100,
        },
      ];

      render(<IncomeTable coursesIncome={mixedData} />);
      
      // Verify table structure remains intact
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4); // 1 header + 3 data rows
      
      // Verify all data is rendered
      expect(screen.getByText('INV-MIX-1')).toBeInTheDocument();
      expect(screen.getByText('INV-MIX-2-VERY-LONG-INVOICE-NUMBER')).toBeInTheDocument();
      expect(screen.getByText('A Short')).toBeInTheDocument();
      expect(screen.getByText('V Verylonglastname')).toBeInTheDocument();
      expect(screen.getByText('0 DA')).toBeInTheDocument();
      expect(screen.getByText('999999.99 DA')).toBeInTheDocument();
      expect(screen.getByText('-100 DA')).toBeInTheDocument();
    });

    it('handles rapid data updates without breaking', () => {
      const initialData = [
        {
          invoice: 'INV-INITIAL',
          date: new Date('2023-01-01'),
          firstName: 'initial',
          lastName: 'user',
          course: 'initial course',
          price: 1000,
        },
      ];

      const { rerender } = render(<IncomeTable coursesIncome={initialData} />);

      // Rapid updates
      for (let i = 0; i < 5; i++) {
        const updatedData = [
          {
            invoice: `INV-UPDATE-${i}`,
            date: new Date(`2023-0${i + 1}-01`),
            firstName: `user${i}`,
            lastName: `update${i}`,
            course: `course${i}`,
            price: i * 1000,
          },
        ];
        
        rerender(<IncomeTable coursesIncome={updatedData} />);
        
        expect(screen.getByText(`INV-UPDATE-${i}`)).toBeInTheDocument();
      }
    });
  });

  describe('Data Type Validation', () => {
    it('handles non-standard date objects', () => {
      const invalidDateData = [
        {
          invoice: 'INV-INVALID-DATE',
          date: new Date('invalid-date'),
          firstName: 'test',
          lastName: 'user',
          course: 'testing',
          price: 1000,
        },
      ];

      // This would typically result in "Invalid Date" being displayed
      render(<IncomeTable coursesIncome={invalidDateData} />);
      
      // The component should still render without crashing
      expect(screen.getByText('INV-INVALID-DATE')).toBeInTheDocument();
      expect(screen.getByText('T User')).toBeInTheDocument();
    });

    it('handles price values that are strings (type coercion)', () => {
      const stringPriceData = [
        {
          invoice: 'INV-STRING-PRICE',
          date: new Date('2023-06-15'),
          firstName: 'string',
          lastName: 'price',
          course: 'testing',
          price: '1500' as any, // Simulating incorrect type
        },
      ];

      render(<IncomeTable coursesIncome={stringPriceData} />);
      
      expect(screen.getByText('1500 DA')).toBeInTheDocument();
    });
  });

  describe('Performance Edge Cases', () => {
    it('handles single record efficiently', () => {
      const singleRecord = [
        {
          invoice: 'INV-SINGLE',
          date: new Date('2023-06-15'),
          firstName: 'single',
          lastName: 'record',
          course: 'performance',
          price: 1000,
        },
      ];

      const renderStart = performance.now();
      render(<IncomeTable coursesIncome={singleRecord} />);
      const renderEnd = performance.now();

      expect(renderEnd - renderStart).toBeLessThan(100); // Should render quickly
      expect(screen.getByText('INV-SINGLE')).toBeInTheDocument();
    });

    it('renders empty table efficiently', () => {
      const renderStart = performance.now();
      render(<IncomeTable coursesIncome={[]} />);
      const renderEnd = performance.now();

      expect(renderEnd - renderStart).toBeLessThan(50); // Should be very fast
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });
});