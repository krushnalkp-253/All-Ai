export default function DeveloperCredits() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Developer Credits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center">
              <h4 className="font-medium text-gray-800 dark:text-gray-200">John Doe</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lead Developer</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">john.doe@example.com</p>
            </div>
            <div className="text-center">
              <h4 className="font-medium text-gray-800 dark:text-gray-200">Jane Smith</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">UI/UX Designer</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">jane.smith@example.com</p>
            </div>
            <div className="text-center">
              <h4 className="font-medium text-gray-800 dark:text-gray-200">Alex Johnson</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Backend Engineer</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">alex.johnson@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
