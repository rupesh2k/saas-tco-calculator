# SaaS TCO Calculator

An open-source Total Cost of Ownership (TCO) calculator for SaaS platforms and infrastructure cost modeling. Built with React, TypeScript, and Vite.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Features

- **Comprehensive Cost Modeling**: Track costs across multiple categories including compute, database, storage, network, licensing, and operations
- **Flexible Input Options**: Support for both monthly and annual cost periods with automatic conversion
- **Unit-based Calculations**: Define costs by quantity and unit price for accurate scaling
- **Cost Visualization**: Interactive charts showing cost breakdown and growth projections
- **Cost Per Unit Analysis**: Calculate cost per application, user, or any unit you define
- **Growth Projections**: Model future costs with configurable growth rates and time periods
- **Import/Export**: Save and load your TCO configurations as JSON files for team collaboration
- **GitHub Integration**: Load and save configurations directly from GitHub repositories
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Built-in theme switching for comfortable viewing

## Demo

Visit the live demo at: [https://rupesh2k.github.io/saas-tco-calculator](https://rupesh2k.github.io/saas-tco-calculator)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rupesh2k/saas-tco-calculator.git
cd saas-tco-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be available in the `dist` directory.

## Usage

### Basic Workflow

1. **Add Cost Categories**: Click "Add Category" to create custom cost categories beyond the defaults
2. **Configure Cost Items**: For each category, add items with:
   - Name (e.g., "EC2 Instances")
   - Quantity (e.g., 10)
   - Unit Cost (e.g., $150)
   - Period (monthly or annual)
3. **Set Unit Count**: Define the number of applications, users, or units to calculate per-unit costs
4. **Configure Growth**: Set annual growth rate and projection years to model future costs
5. **Save Configuration**: Click "Save" to export your configuration as a JSON file
6. **Load Configuration**: Click "Load" to import a previously saved configuration

### Using Sample Configuration

A sample configuration file (`sample-tco-config.json`) is included with realistic cost data. To use it:

1. Click the "Load" button in the application
2. Select `sample-tco-config.json` from the project root
3. Review and modify the costs to match your infrastructure

### GitHub Integration

You can now save and load your TCO configurations directly from GitHub repositories:

#### Setup

1. Click "Save > GitHub Settings" in the application
2. Generate a Personal Access Token:
   - Go to [GitHub Settings > Tokens](https://github.com/settings/tokens/new?scopes=repo&description=TCO%20Calculator)
   - Select the `repo` scope (full control of private repositories)
   - Generate and copy your token
3. Enter your token in the GitHub Settings dialog
4. Select your repository from the list
5. Browse and select your JSON file (or create a new one)
6. Click "Save Settings"

#### Loading from GitHub

1. Click "Load > From GitHub"
2. Your configuration will be loaded from the configured GitHub repository
3. The app displays which repository and file you're connected to

#### Saving to GitHub

1. Click "Save > To GitHub"
2. Enter a descriptive commit message
3. Your configuration will be committed to GitHub
4. The commit includes your changes with the message you provided

#### Security Note

Your GitHub token is stored locally in your browser's localStorage. For security:
- Use a fine-grained Personal Access Token with minimal permissions
- Only grant access to specific repositories if possible
- Never share your token with others
- Revoke tokens you no longer need at [GitHub Settings > Tokens](https://github.com/settings/tokens)

### Configuration File Format

Configuration files are JSON format with the following structure:

```json
{
  "categories": [
    {
      "id": "compute",
      "label": "Compute",
      "icon": "Server",
      "items": [
        {
          "id": "vm-1",
          "name": "Virtual Machines",
          "quantity": 50,
          "unitCost": 150,
          "period": "monthly",
          "monthlyCost": 7500,
          "notes": "Production VMs"
        }
      ]
    }
  ],
  "appCount": 1000000,
  "annualGrowthRate": 15,
  "projectionYears": 5
}
```

## Use Cases

### Team Collaboration

1. **Budget Planning**: Model infrastructure costs for upcoming quarters or years
2. **Cost Optimization**: Compare different infrastructure configurations
3. **Stakeholder Communication**: Share cost breakdowns with leadership
4. **Vendor Comparison**: Evaluate cloud providers or service options
5. **Migration Planning**: Model costs for cloud migrations or platform changes

### Sharing Configurations

Teams can:
- **Via GitHub**: Store configurations in a shared GitHub repository (recommended)
  - Automatic version control and history
  - Easy collaboration with commit messages
  - Branch-based workflows for different scenarios
- **Via Files**: Export configurations as JSON files
  - Store in version control (git)
  - Share via email, Slack, or other channels
- **Multiple Scenarios**: Maintain different files for optimistic, pessimistic, and realistic projections

## Technology Stack

- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality component library
- **Recharts**: Data visualization
- **React Router**: Client-side routing

## Project Structure

```
saas-tco-calculator/
├── src/
│   ├── components/
│   │   ├── github/        # GitHub integration components
│   │   ├── tco/           # TCO-specific components
│   │   └── ui/            # Reusable UI components
│   ├── hooks/
│   │   ├── useTCOStore.ts # Main state management
│   │   └── useGitHubStore.ts # GitHub integration
│   ├── lib/
│   │   ├── github.ts      # GitHub API client
│   │   └── storage.ts     # Local storage utilities
│   ├── types/
│   │   ├── tco.ts         # TCO TypeScript types
│   │   └── github.ts      # GitHub TypeScript types
│   ├── pages/
│   │   └── Index.tsx      # Main application page
│   └── App.tsx
├── sample-tco-config.json # Example configuration
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development

### Running Tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Building for Development

```bash
npm run build:dev
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**rupesh2k**

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

## Support

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/rupesh2k/saas-tco-calculator/issues)
- Check existing issues before creating new ones

## Roadmap

Future enhancements:
- Multi-currency support
- Advanced reporting and export formats (PDF, Excel)
- Cost comparison between scenarios
- Budget alerts and thresholds
- Integration with cloud provider APIs for real-time cost data
- Team collaboration features with shared workspaces
- Historical cost tracking

---

Made with care for infrastructure teams, finance departments, and anyone modeling SaaS costs.
