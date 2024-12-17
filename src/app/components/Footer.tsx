export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12">
      <div className="container m-auto">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-blue-300">About</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Company</li>
              <li>Team</li>
              <li>Careers</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-blue-300">
              Product
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>Features</li>
              <li>Pricing</li>
              <li>Security</li>
              <li>Integrations</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-blue-300">
              Resources
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Support</li>
              <li>Training</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-blue-300">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Security</li>
              <li>Compliance</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-400">
          <p>&copy; 2024 URUZ Point of sale system. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
