export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black py-12">
      <div className="container m-auto">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">About</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Company</li>
              <li>Team</li>
              <li>Careers</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Features</li>
              <li>Pricing</li>
              <li>Security</li>
              <li>Integrations</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Documentation</li>
              <li>API Reference</li>
              <li>Support</li>
              <li>Training</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Security</li>
              <li>Compliance</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-400">
          <p>&copy; 2024 URUZ POS SAAS System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
