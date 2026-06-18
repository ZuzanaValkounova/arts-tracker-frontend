// TODO settings (GET /api/users/avatars + PATCH /api/users/current)
const UserMenu = ({ user, onLogout }) => {
	return (
		<div className="flex items-center gap-2 px-2 py-1">
			{user?.image ? (
				<img src={user.image} alt={user.username} className="h-8 w-8 rounded-full object-cover" />
			) : (
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
					{user?.username ?? "?"}
				</div>
			)}
			<span className="flex-1 truncate text-sm">{user?.username}</span>
			<button
				type="button"
				onClick={onLogout}
				className="text-xs text-gray-400 hover:text-gray-700"
				title="Log out">
				Logout
			</button>
		</div>
	);
};

export { UserMenu };
